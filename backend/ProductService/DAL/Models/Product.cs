using System.ComponentModel.DataAnnotations;

namespace ProductService.DAL.Models
{
    public class Product
    {
        [Key]
        public int ProductID { get; set; }

        [Required]
        [MaxLength(50)]
        public string? ProductName { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Category { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }



    }
}
