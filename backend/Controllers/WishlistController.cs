using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get user's wishlist
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<WishlistDto>> GetWishlist()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound("User not found");

            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p!.Images)
                .Include(w => w.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p!.Brand)
                .FirstOrDefaultAsync(w => w.UserId == user.Id);

            if (wishlist == null)
            {
                // Create wishlist if it doesn't exist
                wishlist = new Wishlist { UserId = user.Id };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();
            }

            var wishlistDto = new WishlistDto
            {
                Id = wishlist.Id,
                Items = wishlist.Items.Select(i => new WishlistItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? "",
                    ProductPrice = i.Product?.Price ?? 0,
                    ProductImage = i.Product?.Images?.FirstOrDefault()?.ImageUrl ?? "",
                    BrandName = i.Product?.Brand?.Name ?? "",
                    InStock = i.Product?.Stock > 0
                }).ToList()
            };

            return Ok(wishlistDto);
        }

        // Add item to wishlist
        [HttpPost("add/{productId}")]
        [Authorize]
        public async Task<ActionResult> AddToWishlist(int productId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound("User not found");

            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Product not found");

            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                .FirstOrDefaultAsync(w => w.UserId == user.Id);

            if (wishlist == null)
            {
                wishlist = new Wishlist { UserId = user.Id };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();
            }

            // Check if already in wishlist
            if (wishlist.Items.Any(i => i.ProductId == productId))
            {
                return BadRequest("Product already in wishlist");
            }

            var wishlistItem = new WishlistItem
            {
                WishlistId = wishlist.Id,
                ProductId = productId
            };

            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product added to wishlist" });
        }

        // Remove item from wishlist
        [HttpDelete("remove/{productId}")]
        [Authorize]
        public async Task<ActionResult> RemoveFromWishlist(int productId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound("User not found");

            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                .FirstOrDefaultAsync(w => w.UserId == user.Id);

            if (wishlist == null) return NotFound("Wishlist not found");

            var wishlistItem = wishlist.Items.FirstOrDefault(i => i.ProductId == productId);
            if (wishlistItem == null) return NotFound("Item not in wishlist");

            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product removed from wishlist" });
        }

        // Check if product is in wishlist
        [HttpGet("check/{productId}")]
        [Authorize]
        public async Task<ActionResult<bool>> IsInWishlist(int productId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound("User not found");

            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                .FirstOrDefaultAsync(w => w.UserId == user.Id);

            if (wishlist == null) return Ok(false);

            var isInWishlist = wishlist.Items.Any(i => i.ProductId == productId);
            return Ok(isInWishlist);
        }

        // Clear wishlist
        [HttpDelete("clear")]
        [Authorize]
        public async Task<ActionResult> ClearWishlist()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound("User not found");

            var wishlist = await _context.Wishlists
                .Include(w => w.Items)
                .FirstOrDefaultAsync(w => w.UserId == user.Id);

            if (wishlist == null) return NotFound("Wishlist not found");

            _context.WishlistItems.RemoveRange(wishlist.Items);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Wishlist cleared" });
        }
    }

    // DTOs
    public class WishlistDto
    {
        public int Id { get; set; }
        public List<WishlistItemDto> Items { get; set; } = new();
    }

    public class WishlistItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public string ProductImage { get; set; } = string.Empty;
        public string BrandName { get; set; } = string.Empty;
        public bool InStock { get; set; }
    }
}
