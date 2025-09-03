namespace InventoryService.DTOs
{
    public class InventoryAddDTO
    {
        public int StoreID { get; set; }
        public int ProductID { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public int QuantityInStock { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
