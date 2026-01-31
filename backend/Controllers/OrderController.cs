using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrderController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // 1. Create Order ID for Razorpay
        [HttpPost("create-razorpay-order")]
        [Authorize]
        public async Task<ActionResult<RazorpayOrderResponse>> CreateRazorpayOrder()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (userEmail == null) return Unauthorized();

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null) return NotFound("User not found");

                // Get cart total logic (Reuse logic ideally, but duplicating for safety now)
                var cart = await _context.Carts.Include(c => c.Items).ThenInclude(i => i.Product).FirstOrDefaultAsync(c => c.UserId == user.Id);
                if (cart == null || !cart.Items.Any()) return BadRequest("Cart is empty");

                decimal totalAmount = cart.Items.Sum(i => i.Product!.Price * i.Quantity);

                // Initialize Razorpay
                string keyId = _configuration["Razorpay:KeyId"] ?? "rzp_test_YOUR_KEY_HERE";
                string keySecret = _configuration["Razorpay:KeySecret"] ?? "YOUR_SECRET_HERE";
                
                if (keyId.Contains("YOUR_KEY"))
                {
                   // Fallback for demo if no key provided yet
                   return Ok(new RazorpayOrderResponse 
                   { 
                       OrderId = "order_Simulated_" + DateTime.Now.Ticks, 
                       KeyId = "rzp_test_simulated",
                       Amount = totalAmount * 100,
                       Currency = "INR"
                   });
                }

                Razorpay.Api.RazorpayClient client = new Razorpay.Api.RazorpayClient(keyId, keySecret);
                
                Dictionary<string, object> options = new Dictionary<string, object>();
                options.Add("amount", totalAmount * 100); // Amount in paise
                options.Add("currency", "INR");
                options.Add("receipt", "order_rcptid_" + DateTime.Now.Ticks);
                options.Add("payment_capture", 1); // Auto capture

                Razorpay.Api.Order order = client.Order.Create(options);
                string orderId = order["id"].ToString();

                return Ok(new RazorpayOrderResponse
                {
                    OrderId = orderId,
                    KeyId = keyId,
                    Amount = totalAmount * 100,
                    Currency = "INR"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error creating Razorpay order: " + ex.Message);
            }
        }

        // Create Order (Checkout)
        [HttpPost("checkout")]
        [Authorize]
        public async Task<ActionResult<OrderResponseDto>> Checkout([FromBody] CheckoutRequest request)
        {
            try 
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (userEmail == null) return Unauthorized();

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null) return NotFound("User not found");

                // Get user's cart
                var cart = await _context.Carts
                    .Include(c => c.Items)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == user.Id);

                if (cart == null || !cart.Items.Any())
                    return BadRequest("Cart is empty");

                // Validate stock and product existence
                foreach (var item in cart.Items)
                {
                    if (item.Product == null)
                    {
                        // Clean up invalid cart items? For now just error.
                        return BadRequest($"Cart contains invalid product (ID: {item.ProductId})");
                    }
                    if (item.Product.Stock < item.Quantity)
                        return BadRequest($"Insufficient stock for {item.Product.Name}");
                }

                // Calculate total
                decimal totalAmount = cart.Items.Sum(i => i.Product!.Price * i.Quantity);

                // Create Order
                var order = new Order
                {
                    UserId = user.Id,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    ShippingAddress = request.ShippingAddress,
                    ShippingCity = request.ShippingCity,
                    ShippingState = request.ShippingState,
                    ShippingZipCode = request.ShippingZipCode,
                    ShippingPhone = request.ShippingPhone,
                    ExpectedDeliveryDate = DateTime.UtcNow.AddDays(7), // 7 days default
                    Items = cart.Items.Select(ci => new OrderItem
                    {
                        ProductId = ci.ProductId,
                        Quantity = ci.Quantity,
                        Price = ci.Product!.Price
                    }).ToList()
                };

                // Process Payment Object
                var payment = new Payment
                {
                    TransactionId = GenerateTransactionId(),
                    PaymentMethod = request.PaymentMethod,
                    Amount = totalAmount,
                    Status = "Pending",
                    PaymentDate = DateTime.UtcNow
                };

                // Simulate payment processing
                if (await ProcessPayment(request, totalAmount))
                {
                    payment.Status = "Success";
                    order.Status = "Processing";
                    
                    // Update stock
                    foreach (var item in cart.Items)
                    {
                        item.Product!.Stock -= item.Quantity;
                    }

                    // Clear cart
                    _context.CartItems.RemoveRange(cart.Items);
                }
                else
                {
                    payment.Status = "Failed";
                    order.Status = "Cancelled";
                }

                // SAVE ORDER FIRST to generate ID
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // SAVE PAYMENT with correct OrderId
                payment.OrderId = order.Id;
                payment.Order = null; // Prevent circular re-add
                
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new OrderResponseDto
                {
                    OrderId = order.Id,
                    OrderNumber = $"ORD{order.Id:D6}",
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    PaymentStatus = payment.Status,
                    TransactionId = payment.TransactionId,
                    ExpectedDeliveryDate = order.ExpectedDeliveryDate,
                    CustomerName = user.Name,
                    Message = payment.Status == "Success" 
                        ? "Order placed successfully!" 
                        : "Payment failed. Please try again."
                });
            } 
            catch (Exception ex) 
            {
                // return BadRequest so the frontend alerts the actual error
                return StatusCode(500, $"Internal Server Error: {ex.Message} - {ex.InnerException?.Message}");
            }
        }

        // Get User Orders
        [HttpGet("my-orders")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) 
            {
                Console.WriteLine($"GetMyOrders: User not found for email {userEmail}");
                return NotFound();
            }

            Console.WriteLine($"GetMyOrders: Fetching orders for User ID {user.Id} ({user.Email})");

            var orders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .Where(o => o.UserId == user.Id)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            Console.WriteLine($"GetMyOrders: Found {orders.Count} orders.");

            return Ok(orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = $"ORD{o.Id:D6}",
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                TrackingNumber = o.TrackingNumber,
                ExpectedDeliveryDate = o.ExpectedDeliveryDate,
                ShippedDate = o.ShippedDate,
                DeliveredDate = o.DeliveredDate,
                ShippingAddress = o.ShippingAddress,
                ShippingCity = o.ShippingCity,
                ShippingState = o.ShippingState,
                ShippingZipCode = o.ShippingZipCode,
                Items = o.Items.Select(oi => new OrderItemDto
                {
                    ProductName = oi.Product?.Name ?? "",
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList(),
                PaymentMethod = o.Payment?.PaymentMethod ?? "",
                PaymentStatus = o.Payment?.Status ?? ""
            }));
        }

        // Get Single Order Details
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound();

            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == user.Id);

            if (order == null) return NotFound();

            return Ok(new OrderDto
            {
                Id = order.Id,
                OrderNumber = $"ORD{order.Id:D6}",
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                TrackingNumber = order.TrackingNumber,
                ExpectedDeliveryDate = order.ExpectedDeliveryDate,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                ShippingAddress = order.ShippingAddress,
                ShippingCity = order.ShippingCity,
                ShippingState = order.ShippingState,
                ShippingZipCode = order.ShippingZipCode,
                ShippingPhone = order.ShippingPhone,
                Items = order.Items.Select(oi => new OrderItemDto
                {
                    ProductName = oi.Product?.Name ?? "",
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList(),
                PaymentMethod = order.Payment?.PaymentMethod ?? "",
                PaymentStatus = order.Payment?.Status ?? "",
                TransactionId = order.Payment?.TransactionId ?? ""
            });
        }

        // Admin: Update Order Status
        [HttpPut("{id}/status")]
        // [Authorize(Roles = "Admin")] // Uncomment when role middleware is ready
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = request.Status;

            if (request.Status == "Shipped" && !order.ShippedDate.HasValue)
            {
                order.ShippedDate = DateTime.UtcNow;
                order.TrackingNumber = request.TrackingNumber ?? GenerateTrackingNumber();
            }

            if (request.Status == "Delivered" && !order.DeliveredDate.HasValue)
            {
                order.DeliveredDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Order status updated", order });
        }

        // Helper Methods
        private string GenerateTransactionId()
        {
            return $"TXN{DateTime.UtcNow.Ticks}{new Random().Next(1000, 9999)}";
        }

        private string GenerateTrackingNumber()
        {
            return $"TRK{DateTime.UtcNow:yyyyMMdd}{new Random().Next(10000, 99999)}";
        }

        private async Task<bool> ProcessPayment(CheckoutRequest request, decimal amount)
        {
            // Razorpay Payment
            if (request.PaymentMethod == "Razorpay")
            {
                if (string.IsNullOrEmpty(request.RazorpayPaymentId) || string.IsNullOrEmpty(request.RazorpayOrderId) || string.IsNullOrEmpty(request.RazorpaySignature))
                {
                    return false;
                }

                // If simulated
                if (request.RazorpayOrderId.StartsWith("order_Simulated"))
                {
                    return true; 
                }

                try
                {
                    string keySecret = _configuration["Razorpay:KeySecret"]!;
                    
                    // Manual signature verification
                    string payload = request.RazorpayOrderId + "|" + request.RazorpayPaymentId;
                    string expectedSignature = ComputeHmacSha256(payload, keySecret);
                    
                    if (expectedSignature == request.RazorpaySignature)
                    {
                        return true;
                    }
                    return false;
                }
                catch (Exception)
                {
                    return false;
                }
            }

            // Simulate payment processing for cards (Demo Only)
            await Task.Delay(500); 
            
            if (request.PaymentMethod == "Credit Card" || request.PaymentMethod == "Debit Card")
            {
                // Basic validation
                return !string.IsNullOrEmpty(request.CardNumber) && 
                       request.CardNumber.Length >= 13 &&
                       !string.IsNullOrEmpty(request.CardCVV) &&
                       request.CardCVV.Length == 3;
            }
            
            // For COD, UPI, etc., auto-approve
            return true;
        }

        private string ComputeHmacSha256(string message, string secret)
        {
            var encoding = new System.Text.UTF8Encoding();
            byte[] keyByte = encoding.GetBytes(secret);
            byte[] messageBytes = encoding.GetBytes(message);
            using (var hmacsha256 = new System.Security.Cryptography.HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                return BitConverter.ToString(hashmessage).Replace("-", "").ToLower();
            }
        }
    }

    // DTOs
    public class CreateRazorpayOrderRequest
    {
        public decimal Amount { get; set; } // Just for validation, backend re-calculates
    }
    
    public class RazorpayOrderResponse
    {
        public string OrderId { get; set; }
        public string KeyId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
    }

    public class CheckoutRequest
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingZipCode { get; set; } = string.Empty;
        public string ShippingPhone { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "Credit Card"; // Razorpay, Credit Card, COD
        // Razorpay Specific
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? RazorpaySignature { get; set; }
        
        // Legacy
        public string? CardNumber { get; set; }
        public string? CardExpiry { get; set; }
        public string? CardCVV { get; set; }
        public string? UpiId { get; set; }
    }

    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string Message { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? TrackingNumber { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string? ShippingCity { get; set; }
        public string? ShippingState { get; set; }
        public string? ShippingZipCode { get; set; }
        public string? ShippingPhone { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
    }

    public class OrderItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public string? TrackingNumber { get; set; }
    }
}
