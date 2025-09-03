using CartService.DAL.Interfaces;
using CartService.DAL.Models;
using CartService.DAL.Repositories;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CartService.BusinessLayer
{
    public class CartBO
    {
        private readonly ICartRepository _repo;

        public CartBO()
        {
            _repo = new CartRepository();
        }

        public string AddItemToCart(CartItem item)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", item.CustomerID),
                new SqlParameter("@ProductID", item.ProductID),
                new SqlParameter("@StoreID", item.StoreID),
                new SqlParameter("@Quantity", item.Quantity),
                new SqlParameter("@UnitPrice", item.UnitPrice)
            };

            return _repo.AddItemToCart(parameters);
        }

        public string RemoveItem(int customerId, int productId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", customerId),
                new SqlParameter("@ProductID", productId)
            };

            return _repo.RemoveItem(parameters);
        }

        public string UpdateQuantity(int customerId, int productId, int quantity)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", customerId),
                new SqlParameter("@ProductID", productId),
                new SqlParameter("@Quantity", quantity)
            };

            return _repo.UpdateQuantity(parameters);
        }

        public string ClearCart(int customerId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", customerId)
            };

            return _repo.ClearCart(parameters);
        }

        public List<CartItemReturn> GetCart(int customerId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", customerId)
            };

            DataSet ds = _repo.GetCart(parameters);
            List<CartItemReturn> items = new();

            if (ds.Tables.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    items.Add(new CartItemReturn
                    {
                        CartItemID = Convert.ToInt32(row["CartItemID"]),
                        CustomerID = Convert.ToInt32(row["CustomerID"]),
                        InventoryID = Convert.ToInt32(row["ProductID"]),
                        StoreID = Convert.ToInt32(row["StoreID"]),
                        Quantity = Convert.ToInt32(row["Quantity"]),
                        UnitPrice = Convert.ToDecimal(row["UnitPrice"])
                    });
                }
            }

            return items;
        }
    }
}
