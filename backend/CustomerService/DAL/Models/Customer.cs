using System.ComponentModel.DataAnnotations;

namespace CustomerService.DAL.Models
{
    public class Customer
    {
        [Key]
        public int CustomerID { get; set; }

        [Required(ErrorMessage = "Full name is required.")]
        [MaxLength(20)]
        public string? CustomerName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(25)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MaxLength(20)]
        [MinLength(6)]
        public string? Password { get; set; }

        [Phone(ErrorMessage = "Invalid phone number.")]
        [MaxLength(10)]
        [Required]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Pincode is required.")]
        [MaxLength(6)]
        public string? Pincode { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [MaxLength(60)]
        public string? Address { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
