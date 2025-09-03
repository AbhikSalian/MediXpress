namespace CustomerService.DTOs
{
    public class UpdateCustomerDTO
    {
        public int CustomerId { get; set; }
        public string PinCode { get; set; }

        public string Address { get; set; }
    }
}
