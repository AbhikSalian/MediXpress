namespace OrderService.DTOs
{
    public class OrderDTO
    {

        public int OrderID { get; set; }
        public int CustomerID { get; set; }
        public int StoreID { get; set; }
        public decimal TotalAmount { get; set; }
        public int DeliveryStatus { get; set; }
        
        public DateTime CreatedAt { get; set; }

    }
}
