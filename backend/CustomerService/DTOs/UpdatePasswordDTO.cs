namespace CustomerService.DTOs
{
    public class UpdatePasswordDTO
    {
        public int CustomerID { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }

    }
}
