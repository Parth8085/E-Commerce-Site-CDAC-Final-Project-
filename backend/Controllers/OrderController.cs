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

        private int GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim == null) return 0;
            return int.Parse(idClaim.Value);
        }

        // Create Order (Checkout) - SIMULATED FOR ALL METHODS
        [HttpPost("checkout")]
        [Authorize]
        public async Task<ActionResult<OrderResponseDto>> Checkout([FromBody] CheckoutRequest request)
        {
            try 
            {
                var userId = GetUserId();
                if (userId == 0) return Unauthorized("Invalid User Token");

                Console.WriteLine($"[Checkout] Starting checkout for User ID: {userId}");

                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound("User not found");

                // Get user's cart
                var cart = await _context.Carts
                    .Include(c => c.Items)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    Console.WriteLine($"[Checkout] Cart is NULL for User ID: {userId}");
                    return BadRequest("Order Failed: Cart is not found (null). Please add items to cart.");
                }

                if (!cart.Items.Any())
                {
                    Console.WriteLine($"[Checkout] Cart has 0 items for User ID: {userId}");
                    return BadRequest("Order Failed: Cart is empty. Please add items to cart.");
                }

                Console.WriteLine($"[Checkout] Found {cart.Items.Count} items in cart.");

                // Validate stock and product existence
                foreach (var item in cart.Items)
                {
                    if (item.Product == null)
                    {
                        Console.WriteLine($"[Checkout] Invalid product ID: {item.ProductId}");
                        return BadRequest($"Cart contains invalid product (ID: {item.ProductId})");
                    }
                    
                    if (item.Product.Stock < item.Quantity)
                    {
                         Console.WriteLine($"[Checkout] Insufficient stock for {item.Product.Name}. Requested: {item.Quantity}, Available: {item.Product.Stock}");
                         return BadRequest($"Insufficient stock for {item.Product.Name}");
                    }
                }

                // Calculate total
                decimal totalAmount = cart.Items.Sum(i => i.Product!.Price * i.Quantity);
                Console.WriteLine($"[Checkout] Total Amount: {totalAmount}");

                // Create Order
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = totalAmount,
                    Status = "Processing", // Default to Processing for simulated success
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

                // Process Payment (Simulated)
                var paymentId = GenerateTransactionId();
                var paymentStatus = "Success"; // Default to success for simulation

                if (request.PaymentMethod == "COD")
                {
                    paymentStatus = "Pending"; // COD is collected on delivery
                }
                
                var payment = new Payment
                {
                    TransactionId = paymentId,
                    PaymentMethod = request.PaymentMethod,
                    Amount = totalAmount,
                    Status = paymentStatus,
                    PaymentDate = DateTime.UtcNow
                };

                // Update stock
                foreach (var item in cart.Items)
                {
                    item.Product!.Stock -= item.Quantity;
                }

                // Clear cart
                _context.CartItems.RemoveRange(cart.Items);

                // SAVE ORDER FIRST to generate ID
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"[Checkout] Order saved. ID: {order.Id}");

                // SAVE PAYMENT with correct OrderId
                payment.OrderId = order.Id;
                payment.Order = null; 
                
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
                    Message = "Order placed successfully!"
                });
            } 
            catch (Exception ex) 
            {
                Console.WriteLine($"[Checkout] Exception: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        
        [HttpGet("my-orders")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
        {
             var userId = GetUserId();
             if (userId == 0) return Unauthorized();

             var orders = await _context.Orders
                 .Include(o => o.Items)
                 .ThenInclude(oi => oi.Product)
                 .Include(o => o.Payment)
                 .Where(o => o.UserId == userId)
                 .OrderByDescending(o => o.OrderDate)
                 .ToListAsync();

             var orderDtos = orders.Select(o => new OrderDto
             {
                 Id = o.Id,
                 OrderNumber = $"ORD{o.Id:D6}",
                 OrderDate = o.OrderDate,
                 TotalAmount = o.TotalAmount,
                 Status = o.Status,
                 ExpectedDeliveryDate = o.ExpectedDeliveryDate,
                 TrackingNumber = o.TrackingNumber,
                 ShippedDate = o.ShippedDate,
                 DeliveredDate = o.DeliveredDate,
                 ShippingAddress = o.ShippingAddress,
                 ShippingCity = o.ShippingCity,
                 Items = o.Items.Select(i => new OrderItemDto
                 {
                     ProductName = i.Product?.Name ?? "Unknown Product",
                     Quantity = i.Quantity,
                     Price = i.Price
                 }).ToList(),
                 PaymentMethod = o.Payment?.PaymentMethod ?? "Unknown",
                 PaymentStatus = o.Payment?.Status ?? "Unknown",
                 TransactionId = o.Payment?.TransactionId ?? ""
             }).ToList();

             return Ok(orderDtos);
        }

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

            var dto = new OrderDto
             {
                 Id = order.Id,
                 OrderNumber = $"ORD{order.Id:D6}",
                 OrderDate = order.OrderDate,
                 TotalAmount = order.TotalAmount,
                 Status = order.Status,
                 ExpectedDeliveryDate = order.ExpectedDeliveryDate,
                 ShippingAddress = order.ShippingAddress,
                 ShippingCity = order.ShippingCity,
                 ShippingState = order.ShippingState,
                 ShippingZipCode = order.ShippingZipCode,
                 ShippingPhone = order.ShippingPhone,
                 Items = order.Items.Select(i => new OrderItemDto
                 {
                     ProductName = i.Product?.Name ?? "Unknown Product",
                     Quantity = i.Quantity,
                     Price = i.Price
                 }).ToList(),
                 PaymentMethod = order.Payment?.PaymentMethod ?? "Unknown",
                 PaymentStatus = order.Payment?.Status ?? "Unknown",
                 TransactionId = order.Payment?.TransactionId ?? ""
             };

             return Ok(dto);
        }


        // Helper Methods
        private string GenerateTransactionId()
        {
            return $"TXN{DateTime.UtcNow.Ticks}{new Random().Next(1000, 9999)}";
        }
    }

    // DTOs
    public class CheckoutRequest
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingZipCode { get; set; } = string.Empty;
        public string ShippingPhone { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "Credit Card"; 
        
        // Legacy/Simulated
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
        
        // Added for thoroughness in frontend usage
        public string ShippingAddress { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingZipCode { get; set; } = string.Empty;
        public string ShippingPhone { get; set; } = string.Empty;
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
}
