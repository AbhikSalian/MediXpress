namespace OrderService.DTOs
{

    public class OrderRequestDTO
    {
        public int CustomerID { get; set; }
        public int StoreID { get; set; }
        public int DeliveryStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemDTO>? Items { get; set; }
    }

}
