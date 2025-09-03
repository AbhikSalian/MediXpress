using System.ComponentModel.DataAnnotations;

namespace InventoryService.DAL.Models
{
    public class Inventory
    {

        [Key]
        public int InventoryID { get; set; }

        [Required]
        public int StoreID { get; set; }

        [Required]
        public int ProductID { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Unit price must be non-negative.")]
        public decimal UnitPrice { get; set; }

        [Range(0, 100, ErrorMessage = "Discount rate must be between 0 and 100.")]
        public decimal DiscountRate { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be non-negative.")]
        public int QuantityInStock { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }

}
