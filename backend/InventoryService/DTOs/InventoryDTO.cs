namespace InventoryService.DTOs
{

    public class InventoryDTO
    {
        public int InventoryID { get; set; } // Used for update/delete
        
        public decimal UnitPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public int QuantityInStock { get; set; }
    }

}
