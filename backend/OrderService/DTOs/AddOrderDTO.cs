using System;

namespace OrderService.DTOs
{
    public class AddOrderDTO
    {
        public int CustomerID { get; set; }
        public int StoreID { get; set; }
        public decimal TotalAmount { get; set; }
        public int DeliveryStatus { get; set; }
       
    }
}
