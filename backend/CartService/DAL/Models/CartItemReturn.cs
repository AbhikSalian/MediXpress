namespace CartService.DAL.Models
{
    public class CartItemReturn
    {
        public int CartItemID { get; set; }
        public int CustomerID { get; set; }
        public int InventoryID { get; set; }
        public int StoreID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
