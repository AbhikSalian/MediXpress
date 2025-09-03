namespace CartService.DAL.Models
{
    public class CartItem
    {
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public int StoreID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
