namespace OrderService.DTOs
{

    public class OrderItemDTO
    {
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

}
