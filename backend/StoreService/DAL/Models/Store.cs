using System.ComponentModel.DataAnnotations;

namespace StoreService.DAL.Models
{
    public class Store
    {

        [Key]
        public int StoreID { get; set; }

        [Required(ErrorMessage = "Store name is required.")]
        [StringLength(20, ErrorMessage = "Store name cannot exceed 100 characters.")]
        public string StoreName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        [MaxLength(10)]
        [MinLength(10)]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Pincode is required.")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Pincode must be a 6-digit number.")]
        public string Pincode { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(60, ErrorMessage = "Address cannot exceed 200 characters.")]
        public string Address { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }


}
