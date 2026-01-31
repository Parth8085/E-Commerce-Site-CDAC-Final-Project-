using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User? User { get; set; }
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled, Delayed
        
        // Tracking Information
        public string? TrackingNumber { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        
        // Shipping Address Snapshot
        public string ShippingAddress { get; set; } = string.Empty; 
        public string? ShippingCity { get; set; }
        public string? ShippingState { get; set; }
        public string? ShippingZipCode { get; set; }
        public string? ShippingPhone { get; set; }
        
        public List<OrderItem> Items { get; set; } = new();
        
        public Payment? Payment { get; set; }
    }
}
