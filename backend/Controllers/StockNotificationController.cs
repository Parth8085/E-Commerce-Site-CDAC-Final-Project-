using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockNotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockNotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Request notification for out-of-stock product
        [HttpPost("request")]
        public async Task<ActionResult> RequestNotification([FromBody] StockNotificationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            // Check if product is actually out of stock
            if (product.Stock > 0)
            {
                return BadRequest("Product is currently in stock");
            }

            // Check if notification already exists for this email and product
            var existingNotification = await _context.StockNotifications
                .FirstOrDefaultAsync(n => n.Email == request.Email && n.ProductId == request.ProductId && !n.IsNotified);

            if (existingNotification != null)
            {
                return Ok(new { message = "You are already subscribed for notifications on this product" });
            }

            var notification = new StockNotification
            {
                Email = request.Email,
                ProductId = request.ProductId
            };

            _context.StockNotifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "We will notify you when this product is back in stock!" });
        }

        // Get all pending notifications for a product (Admin use)
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<List<StockNotification>>> GetProductNotifications(int productId)
        {
            var notifications = await _context.StockNotifications
                .Where(n => n.ProductId == productId && !n.IsNotified)
                .ToListAsync();

            return Ok(notifications);
        }
    }

    public class StockNotificationRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int ProductId { get; set; }
    }
}
