using CartService.DAL.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CartService.DAL.Repositories
{
    public class CartRepository : ICartRepository
    {
        string connectionString;
        SqlConnection connection;
        public CartRepository()
        {
            connectionString = "Data Source=WIN2K22-VM\\SQLEXPRESS;Initial Catalog=MXCartDB;Integrated Security=true;TrustServerCertificate=True;User Id=zadmin;Password=Pass@123";
            connection = new SqlConnection(connectionString);
        }

        public string AddItemToCart(SqlParameter[] parameters)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO CartItems (CustomerID, ProductID, StoreID, Quantity, UnitPrice)
                    VALUES (@CustomerID, @ProductID, @StoreID, @Quantity, @UnitPrice);", connection);

                cmd.Parameters.AddRange(parameters);
                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                return "Item added to cart.";
            }
            catch (Exception ex) { return $"Error: {ex.Message}"; }
            finally { if (connection.State == ConnectionState.Open) connection.Close(); }
        }

        public string RemoveItem(SqlParameter[] parameters)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("DELETE FROM CartItems WHERE CustomerID = @CustomerID AND ProductID = @ProductID", connection);
                cmd.Parameters.AddRange(parameters);
                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                return "Item removed.";
            }
            catch (Exception ex) { return $"Error: {ex.Message}"; }
            finally { if (connection.State == ConnectionState.Open) connection.Close(); }
        }

        public string UpdateQuantity(SqlParameter[] parameters)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("UPDATE CartItems SET Quantity = @Quantity WHERE CustomerID = @CustomerID AND ProductID = @ProductID", connection);
                cmd.Parameters.AddRange(parameters);
                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                return "Quantity updated.";
            }
            catch (Exception ex) { return $"Error: {ex.Message}"; }
            finally { if (connection.State == ConnectionState.Open) connection.Close(); }
        }

        public string ClearCart(SqlParameter[] parameters)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("DELETE FROM CartItems WHERE CustomerID = @CustomerID", connection);
                cmd.Parameters.AddRange(parameters);
                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                return "Cart cleared.";
            }
            catch (Exception ex) { return $"Error: {ex.Message}"; }
            finally { if (connection.State == ConnectionState.Open) connection.Close(); }
        }

        public DataSet GetCart(SqlParameter[] parameters)
        {
            DataSet ds = new();
            try
            {
                using SqlCommand cmd = new SqlCommand("SELECT * FROM CartItems WHERE CustomerID = @CustomerID", connection);
                cmd.Parameters.AddRange(parameters);

                using SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                connection.Open();
                adapter.Fill(ds);
                connection.Close();

                return ds;
            }
            catch { return ds; }
            finally { if (connection.State == ConnectionState.Open) connection.Close(); }
        }


    }
}
