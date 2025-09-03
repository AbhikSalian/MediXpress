using OrderService.DAL.Interfaces;
using OrderService.DAL.Repositories;
using OrderService.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;
using OrderService.DAL.Models;

namespace OrderService.BusinessLayer
{
    public class OrderBO
    {
        private readonly IOrderRepository _repo;

        public OrderBO()
        {
            _repo = new OrderRepository();
        }


        public string PlaceOrder(OrderRequestDTO dto)
        {
            SqlParameter[] orderParams = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", dto.CustomerID),
                new SqlParameter("@StoreID", dto.StoreID),
                new SqlParameter("@TotalAmount", dto.TotalAmount),
                new SqlParameter("@DeliveryStatus", dto.DeliveryStatus),
                new SqlParameter("@CreatedAt", DateTime.Now)
            };

            string result = _repo.CreateOrder(orderParams, out int orderId);
            if (result != "Success") return result;

            foreach (var item in dto.Items)
            {
                SqlParameter[] itemParams = new SqlParameter[]
                {
                    new SqlParameter("@OrderID", orderId),
                    new SqlParameter("@ProductID", item.ProductID),
                    new SqlParameter("@Quantity", item.Quantity),
                    new SqlParameter("@UnitPrice", item.UnitPrice)
                };

                string itemResult = _repo.AddOrderItem(itemParams);
                if (itemResult.StartsWith("Error")) return itemResult;
            }

            return $"Order placed successfully with OrderID: {orderId}";
        }

        //public string CreateOrder(AddOrderDTO dto)
        //{
        //    DateTime now = DateTime.Now;
        //    SqlParameter[] parameters = new SqlParameter[]
        //    {
        //        new SqlParameter("@CustomerID", dto.CustomerID),
        //        new SqlParameter("@StoreID", dto.StoreID),
        //        new SqlParameter("@TotalAmount", dto.TotalAmount),
        //        new SqlParameter("@DeliveryStatus", dto.DeliveryStatus),
        //        new SqlParameter("@CreatedAt", now)
        //    };

        //    return _repo.CreateOrder(parameters);
        //}

        public string UpdateOrderStatus(int orderId, int status)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@OrderID", orderId),
                new SqlParameter("@DeliveryStatus", status)
            };

            return _repo.UpdateOrderStatus(parameters);
        }

        //not in use
        public string DeleteOrder(int orderId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@OrderID", orderId)
            };

            return _repo.DeleteOrder(parameters);
        }//instead used delivery status to 6


        public List<OrderDTO> GetOrdersByCustomer(int customerId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
        new SqlParameter("@CustomerID", customerId)
            };

            DataSet ds = _repo.GetOrdersByCustomer(parameters);
            return ConvertToOrderDTOList(ds);
        }

        public List<OrderDTO> GetOrdersByStore(int storeId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
        new SqlParameter("@StoreID", storeId)
            };

            DataSet ds = _repo.GetOrdersByStore(parameters);
            return ConvertToOrderDTOList(ds);
        }

        private List<OrderDTO> ConvertToOrderDTOList(DataSet ds)
        {
            var orders = new List<OrderDTO>();
            if (ds.Tables.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    orders.Add(new OrderDTO
                    {
                        OrderID = Convert.ToInt32(row["OrderID"]),
                        CustomerID = Convert.ToInt32(row["CustomerID"]),
                        StoreID = Convert.ToInt32(row["StoreID"]),
                        TotalAmount = Convert.ToDecimal(row["TotalAmount"]),
                        DeliveryStatus = Convert.ToInt32(row["DeliveryStatus"]),
                        CreatedAt = Convert.ToDateTime(row["CreatedAt"])
                    });
                }
            }
            return orders;
        }

        public List<OrderItem> GetOrderItems(int orderId)
        {
            List<OrderItem> lstOrderitems = new List<OrderItem>();
            SqlParameter sqlprm = new SqlParameter("@OrderId", orderId);
            DataSet ds = _repo.GetOrderItemsByOrderId(sqlprm);
            foreach (DataRow row in ds.Tables[0].Rows) {
                lstOrderitems.Add(new OrderItem
                {
                    OrderItemID = Convert.ToInt32(row["OrderItemID"]),
                    OrderID = Convert.ToInt32(row["OrderID"]),
                    ProductID = Convert.ToInt32(row["ProductID"]),
                    Quantity = Convert.ToInt32(row["Quantity"]),
                    UnitPrice = Convert.ToInt32(row["UnitPrice"])
                });
            }
            return lstOrderitems;
        }
    }
}
