namespace StoreService.DTOs
{
    public class StoreDTO
    {
        public string? StoreName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Pincode { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
