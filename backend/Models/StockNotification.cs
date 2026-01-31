using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class StockNotification
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        
        public bool IsNotified { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? NotifiedAt { get; set; }
    }
}
