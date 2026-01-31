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
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/user/address
        [HttpPost("address")]
        public async Task<IActionResult> SaveAddress(AddressDto request)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.Include(u => u.Addresses).FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return NotFound("User not found");

            // Update Phone if provided
            if (!string.IsNullOrEmpty(request.Phone))
            {
                user.PhoneNumber = request.Phone;
            }

            // check if the exact same address exists to avoid spamming DB with duplicates
            var existingAddress = user.Addresses.FirstOrDefault(a => 
                a.Street == request.Street && 
                a.City == request.City && 
                a.ZipCode == request.ZipCode);

            if (existingAddress == null)
            {
                var address = new Address
                {
                    Street = request.Street,
                    City = request.City,
                    State = request.State,
                    ZipCode = request.ZipCode,
                    Country = request.Country ?? "India",
                    UserId = user.Id
                };
                _context.Addresses.Add(address);
            }
            // If it exists, we just updated the phone number (above) which is enough.

            await _context.SaveChangesAsync();

            return Ok(new { message = "Address saved successfully" });
        }
    }

    public class AddressDto
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string? Country { get; set; }
        public string? Phone { get; set; } // Phone is on User, not Address, but we handle it here
    }
}
