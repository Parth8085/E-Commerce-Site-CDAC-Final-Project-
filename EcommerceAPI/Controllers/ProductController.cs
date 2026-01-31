using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElectronicsEcommerce.API.Data;
using ElectronicsEcommerce.API.DTOs;
using ElectronicsEcommerce.API.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ElectronicsEcommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts(
            [FromQuery] string? category = null,
            [FromQuery] string? brand = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string? search = null)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(category))
                    query = query.Where(p => p.Category.Name == category);

                if (!string.IsNullOrEmpty(brand))
                    query = query.Where(p => p.Brand == brand);

                if (minPrice.HasValue)
                    query = query.Where(p => p.Price >= minPrice.Value);

                if (maxPrice.HasValue)
                    query = query.Where(p => p.Price <= maxPrice.Value);

                if (!string.IsNullOrEmpty(search))
                    query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

                var products = await query.ToListAsync();

                var productDTOs = new List<ProductDTO>();
                foreach (var product in products)
                {
                    try
                    {
                        productDTOs.Add(new ProductDTO
                        {
                            Id = product.Id,
                            Name = product.Name,
                            Description = product.Description,
                            Price = product.Price,
                            CategoryId = product.CategoryId,
                            CategoryName = product.Category?.Name ?? "",
                            Brand = product.Brand,
                            Stock = product.Stock,
                            Images = ParseImagesSafe(product.Images),
                            CreatedAt = product.CreatedAt
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, $"Error processing product {product.Id}");
                        // Skip problematic products for demo
                    }
                }

                return Ok(productDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetProducts");
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching products",
                    error = ex.Message
                });
            }
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new
            {
                message = "API is working",
                timestamp = DateTime.UtcNow,
                version = "1.0"
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    return NotFound();

                return Ok(new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category?.Name ?? "",
                    Brand = product.Brand,
                    Stock = product.Stock,
                    Images = ParseImagesSafe(product.Images),
                    CreatedAt = product.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting product {id}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            try
            {
                var categories = await _context.Categories
                    .Include(c => c.Products)
                    .ToListAsync();

                return Ok(categories.Select(c => new CategoryDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ProductCount = c.Products.Count
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IEnumerable<string>>> GetBrands()
        {
            try
            {
                var brands = await _context.Products
                    .Select(p => p.Brand)
                    .Distinct()
                    .ToListAsync();

                return Ok(brands);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting brands");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("search/{term}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> SearchProducts(string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                    return BadRequest("Search term is required");

                var products = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.Name.Contains(term) ||
                               p.Description.Contains(term) ||
                               p.Brand.Contains(term) ||
                               (p.Category != null && p.Category.Name.Contains(term)))
                    .Take(10)
                    .ToListAsync();

                var productDTOs = new List<ProductDTO>();
                foreach (var product in products)
                {
                    productDTOs.Add(new ProductDTO
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        CategoryId = product.CategoryId,
                        CategoryName = product.Category?.Name ?? "",
                        Brand = product.Brand,
                        Stock = product.Stock,
                        Images = ParseImagesSafe(product.Images)
                    });
                }

                return Ok(productDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching for: {term}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDTO>> CreateProduct(CreateProductDTO productDto)
        {
            try
            {
                var category = await _context.Categories.FindAsync(productDto.CategoryId);
                if (category == null)
                    return BadRequest("Invalid category");

                var product = new Product
                {
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    CategoryId = productDto.CategoryId,
                    Brand = productDto.Brand,
                    Stock = productDto.Stock,
                    Images = JsonSerializer.Serialize(productDto.Images ?? new List<string>()),
                    Specifications = productDto.Specifications,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    CategoryId = product.CategoryId,
                    CategoryName = category.Name,
                    Brand = product.Brand,
                    Stock = product.Stock,
                    Images = productDto.Images ?? new List<string>()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDTO productDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound();

                product.Name = productDto.Name;
                product.Description = productDto.Description;
                product.Price = productDto.Price;
                product.CategoryId = productDto.CategoryId;
                product.Brand = productDto.Brand;
                product.Stock = productDto.Stock;
                product.Specifications = productDto.Specifications;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating product {id}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound();

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting product {id}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        // Helper method to safely parse images JSON
        private List<string> ParseImagesSafe(string imagesJson)
        {
            if (string.IsNullOrWhiteSpace(imagesJson))
                return new List<string> { "https://via.placeholder.com/300x200?text=Product" };

            try
            {
                var cleanJson = imagesJson.Trim();
                
                // If it's already a JSON array, parse it
                if (cleanJson.StartsWith("[") && cleanJson.EndsWith("]"))
                {
                    var images = JsonSerializer.Deserialize<List<string>>(cleanJson);
                    return images ?? new List<string> { "https://via.placeholder.com/300x200?text=Product" };
                }
                
                // If it's a single string (not JSON), wrap it in array
                if (cleanJson.StartsWith("\"") && cleanJson.EndsWith("\""))
                {
                    cleanJson = $"[{cleanJson}]";
                }
                else
                {
                    cleanJson = $"[{JsonSerializer.Serialize(cleanJson)}]";
                }
                
                var parsedImages = JsonSerializer.Deserialize<List<string>>(cleanJson);
                return parsedImages ?? new List<string> { "https://via.placeholder.com/300x200?text=Product" };
            }
            catch (JsonException)
            {
                // Return placeholder image
                return new List<string> { "https://via.placeholder.com/300x200?text=Product" };
            }
        }

        [HttpGet("debug")]
        public IActionResult DebugEndpoint()
        {
            try
            {
                var productCount = _context.Products.Count();
                var categoryCount = _context.Categories.Count();
                
                return Ok(new
                {
                    status = "API is working",
                    database = "SmartKartDB",
                    productCount,
                    categoryCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}