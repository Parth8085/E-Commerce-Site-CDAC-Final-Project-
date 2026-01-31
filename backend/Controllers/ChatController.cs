using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ChatController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Chat Controller is working!" });
        }

        [HttpPost("ask")]
        public IActionResult Ask([FromBody] ChatRequest request)
        {
            // SIMPLE OFFLINE AI (No API Key needed)
            // This runs locally on your computer and is much faster/reliable for this demo.
            
            var msg = request.Message.ToLower();
            string reply = "";

            if (msg.Contains("hello") || msg.Contains("hi") || msg.Contains("hey"))
            {
                reply = "Hello! Welcome to SmartKartStore. How can I help you find the perfect gadget today?";
            }
            else if (msg.Contains("laptop") || msg.Contains("computer"))
            {
                reply = "We have a great collection of Laptops! You can check out our 'Laptops' category for brands like Apple, Dell, and HP. Are you looking for a gaming laptop or one for work?";
            }
            else if (msg.Contains("mobile") || msg.Contains("phone") || msg.Contains("iphone") || msg.Contains("android"))
            {
                reply = "Our Mobile section features the latest iPhones, Samsung Galaxy, and Google Pixel devices. Visit the 'Mobiles' page to see our best sellers!";
            }
            else if (msg.Contains("price") || msg.Contains("cost") || msg.Contains("expensive"))
            {
                reply = "We offer the best prices in the market! Plus, we have special discounts on selected items. You can sort products by price in any category.";
            }
            else if (msg.Contains("order") || msg.Contains("track") || msg.Contains("shipping"))
            {
                reply = "You can track your orders in the 'My Orders' section (click your profile). We usually ship within 24 hours!";
            }
            else if (msg.Contains("return") || msg.Contains("refund"))
            {
                reply = "We have a hassle-free 7-day return policy for all electronic items. Contact our support if you have any issues.";
            }
            else if (msg.Contains("thank"))
            {
                reply = "You're welcome! Happy shopping at SmartKartStore!";
            }
            else
            {
                reply = "That's an interesting question! While I'm an AI assistant, I recommend browsing our categories or using the search bar to find exactly what you need. Can I help you with anything else?";
            }

            return Ok(new { reply });
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}
