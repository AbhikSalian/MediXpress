using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace OrderService.DAL.Models
{
    public class Order
    {
        [Key]
        public int OrderID { get; set; }

        [Required]
        public int CustomerID { get; set; }

        [Required]
        public int StoreID { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Total amount must be non-negative.")]
        public decimal TotalAmount { get; set; }

        [Required]
        [Range(0, 3, ErrorMessage = "Delivery status must be between 0 and 3.")]
        public int DeliveryStatus { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}