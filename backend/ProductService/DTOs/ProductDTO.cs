using System.ComponentModel.DataAnnotations;

namespace ProductService.DTOs
{
    public class ProductDTO
    {
        public string? ProductName { get; set; }

        public string? Description { get; set; }

        public string? Category { get; set; }
    }
}