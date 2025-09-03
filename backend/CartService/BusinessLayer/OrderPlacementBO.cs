using CartService.DAL.Repositories;
using CartService.DTOs;
using CartService.DAL.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace CartService.BusinessLayer
{
    public class OrderPlacementBO
    {
        private readonly CartBO _cartBO;

        public OrderPlacementBO()
        {
            _cartBO = new CartBO();
        }

        //public async Task<string> PlaceOrderAsync(int customerId, int deliveryStatus)
        //{
        //    var cartItems = _cartBO.GetCart(customerId);
        //    if (cartItems.Count == 0) return "Cart is empty.";

        //    int storeId = cartItems[0].StoreID; 
        //    decimal totalAmount = cartItems.Sum(i => i.UnitPrice * i.Quantity);

        //    var orderPayload = new OrderPlacementDTO
        //    {
        //        CustomerID = customerId,
        //        StoreID = storeId,
        //        DeliveryStatus = deliveryStatus,
        //        TotalAmount = totalAmount,
        //        Items = cartItems.Select(i => new CartItemDTO
        //        {
        //            ProductID = i.InventoryID,
        //            Quantity = i.Quantity,
        //            UnitPrice = i.UnitPrice
        //        }).ToList()
        //    };

        //    using HttpClient client = new HttpClient();
        //    var json = JsonSerializer.Serialize(orderPayload);
        //    var content = new StringContent(json, Encoding.UTF8, "application/json");

        //    var response = await client.PostAsync("https://localhost:7065/api/Order/place", content); // adjust URL
        //    if (response.IsSuccessStatusCode)
        //    {
        //        _cartBO.ClearCart(customerId);
        //        return "Order placed successfully.";
        //    }

        //    return "Failed to place order.";
        //}

        public async Task<string> PlaceOrderAsync(int customerId, int deliveryStatus)
        {
            var cartItems = _cartBO.GetCart(customerId);
            if (cartItems.Count == 0) return "Cart is empty.";

            int storeId = cartItems[0].StoreID;
            decimal totalAmount = cartItems.Sum(i => i.UnitPrice * i.Quantity);

            var orderPayload = new OrderPlacementDTO
            {
                CustomerID = customerId,
                StoreID = storeId,
                DeliveryStatus = deliveryStatus,
                TotalAmount = totalAmount,
                Items = cartItems.Select(i => new CartItemDTO
                {
                    ProductID = i.InventoryID,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            using HttpClient client = new HttpClient();
            var json = JsonSerializer.Serialize(orderPayload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("https://localhost:7065/api/Order/place", content);
            if (response.IsSuccessStatusCode)
            {
                // Reduce stock in Inventory Service
                foreach (var item in cartItems)
                {
                    var inventoryUpdatePayload = new
                    {
                        InventoryID = item.InventoryID,
                        QuantityToReduce = item.Quantity
                    };

                    var inventoryJson = JsonSerializer.Serialize(inventoryUpdatePayload);
                    var inventoryContent = new StringContent(inventoryJson, Encoding.UTF8, "application/json");

                    var inventoryResponse = await client.PostAsync("https://localhost:8040/api/Inventory/reduce-stock", inventoryContent);
                    if (!inventoryResponse.IsSuccessStatusCode)
                    {
                        // Optionally log or handle failure
                        return "Order placed, but failed to update inventory.";
                    }
                }

                _cartBO.ClearCart(customerId);
                return "Order placed successfully and inventory updated.";
            }

            return "Failed to place order.";
        }
    }
}
