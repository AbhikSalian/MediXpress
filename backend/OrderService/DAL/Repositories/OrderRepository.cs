using OrderService.DAL.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace OrderService.DAL.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        string connectionString;
        SqlConnection connection;
        public OrderRepository()
        {
            connectionString = "Data Source=WIN2K22-VM\\SQLEXPRESS;Initial Catalog=MXOrderDB;Integrated Security=true;TrustServerCertificate=True;User Id=zadmin;Password=Pass@123";
            connection = new SqlConnection(connectionString);
        }


        public string CreateOrder(SqlParameter[] orderParams, out int orderId)
        {
            orderId = 0;
            try
            {
                using SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Orders (CustomerID, StoreID, TotalAmount, DeliveryStatus, CreatedAt)
                    VALUES (@CustomerID, @StoreID, @TotalAmount, @DeliveryStatus, @CreatedAt);
                    SELECT SCOPE_IDENTITY();", connection);

                cmd.Parameters.AddRange(orderParams);
                connection.Open();
                var result = cmd.ExecuteScalar();
                connection.Close();

                if (result != null && int.TryParse(result.ToString(), out orderId))
                    return "Success";

                return "Failed to create order.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }

        public string AddOrderItem(SqlParameter[] itemParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice)
                    VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);", connection);

                cmd.Parameters.AddRange(itemParams);
                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                return "Item added.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }
    


       
        public string UpdateOrderStatus(SqlParameter[] statusParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("UPDATE Orders SET DeliveryStatus = @DeliveryStatus WHERE OrderID = @OrderID", connection);
                cmd.Parameters.AddRange(statusParams);
                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                return rowsAffected > 0 ? "Updated successfully." : "Update failed.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }

        public string DeleteOrder(SqlParameter[] deleteParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("DELETE FROM Orders WHERE OrderID = @OrderID", connection);
                cmd.Parameters.AddRange(deleteParams);
                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                return rowsAffected > 0 ? "Deleted successfully." : "Delete failed.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }

        public DataSet GetOrdersByCustomer(SqlParameter[] customerParams)
        {
            DataSet ds = new DataSet();
            try
            {
                using SqlCommand cmd = new SqlCommand("SELECT * FROM Orders WHERE CustomerID = @CustomerID", connection);
                cmd.Parameters.AddRange(customerParams);

                using SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                connection.Open();
                adapter.Fill(ds);
                connection.Close();

                return ds;
            }
            catch
            {
                return ds;
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }

        public DataSet GetOrdersByStore(SqlParameter[] storeParams)
        {
            DataSet ds = new DataSet();
            try
            {
                using SqlCommand cmd = new SqlCommand("SELECT * FROM Orders WHERE StoreID = @StoreID", connection);
                cmd.Parameters.AddRange(storeParams);

                using SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                connection.Open();
                adapter.Fill(ds);
                connection.Close();

                return ds;
            }
            catch
            {
                return ds;
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }

        public DataSet GetOrderItemsByOrderId(SqlParameter orderIdprm)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;
                cmd.CommandText = "SELECT * FROM OrderItems WHERE OrderID=@OrderId";
                cmd.Parameters.Add(orderIdprm);

                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(ds);
                connection.Close();
                return ds;
            }
            catch (Exception ex)
            {
                return ds;
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();

            }
        }
    }
}