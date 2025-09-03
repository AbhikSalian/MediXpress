using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs
{
    public class CustomerDTO
    {
        
        public string? CustomerName { get; set; }

        public string? Email { get; set; }

        
        public string? Password { get; set; }

       
        public string? Phone { get; set; }

       
        public string? Pincode { get; set; }

       
        public string? Address { get; set; }

       
    }
}
