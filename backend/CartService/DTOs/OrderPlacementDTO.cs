namespace CartService.DTOs
{

    public class OrderPlacementDTO
    {
        public int CustomerID { get; set; }
        public int StoreID { get; set; }
        public int DeliveryStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public List<CartItemDTO> Items { get; set; }
    }

}
