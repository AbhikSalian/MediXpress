using InventoryService.DAL.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.SqlTypes;

namespace InventoryService.DAL.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        string connectionString;
        SqlConnection connection;
        public InventoryRepository()
        {
            connectionString = "Data Source=WIN2K22-VM\\SQLEXPRESS;Initial Catalog=MXInventoryDB;Integrated Security=true;TrustServerCertificate=True;User Id=zadmin;Password=Pass@123";
            connection = new SqlConnection(connectionString);
        }

        public string AddInventory(SqlParameter[] inventoryParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("INSERT INTO Inventory (StoreID, ProductID, UnitPrice, DiscountRate, QuantityInStock, CreatedAt) VALUES (@StoreID, @ProductID, @UnitPrice, @DiscountRate, @QuantityInStock, @CreatedAt)", connection);
                cmd.Parameters.AddRange(inventoryParams);

                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                return rowsAffected > 0 ? "Success" : "Failed to add inventory.";
            }
            catch (SqlException ex)
            {
                return $"SQL Error: {ex.Message}";
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

        public DataSet GetInventoryByStore(SqlParameter[] storeParams)
        {
            DataSet ds = new DataSet();
            try
            {
                using SqlCommand cmd = new SqlCommand("SELECT * FROM Inventory WHERE StoreID = @StoreID", connection);
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

        public string UpdateInventory(SqlParameter[] updateParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("UPDATE Inventory SET UnitPrice = @UnitPrice, DiscountRate = @DiscountRate, QuantityInStock = @QuantityInStock WHERE InventoryID = @InventoryID", connection);
                cmd.Parameters.AddRange(updateParams);

                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                return rowsAffected > 0 ? "Updated successfully." : "Update failed.";
            }
            catch (SqlException ex)
            {
                return $"SQL Error: {ex.Message}";
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

        public string DeleteInventory(SqlParameter[] deleteParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("DELETE FROM Inventory WHERE InventoryID = @InventoryID", connection);
                cmd.Parameters.AddRange(deleteParams);

                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                return rowsAffected > 0 ? "Deleted successfully." : "Delete failed.";
            }
            catch (SqlException ex)
            {
                return $"SQL Error: {ex.Message}";
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

        public DataSet GetProductID(SqlParameter sqlprmInvID)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;
                cmd.Parameters.Add(sqlprmInvID);
                cmd.CommandText = "SELECT ProductID FROM Inventory WHERE InventoryID=@inventorytID";
                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(ds);
                connection.Close();

                return ds;
            }
            catch(Exception ex)
            {
                return ds;
            }
            
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
            
            
        }


        public async Task<bool> ReduceStockAsync(SqlParameter[] parameters)
        {
            using SqlCommand cmd = new SqlCommand("UPDATE Inventory SET QuantityInStock = QuantityInStock - @QuantityToReduce WHERE InventoryID = @InventoryID AND QuantityInStock >= @QuantityToReduce", connection );

            cmd.Parameters.AddRange(parameters);

            await connection.OpenAsync();
            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }


        public DataSet GetInventory(SqlParameter sqlPrm)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;
                cmd.Parameters.Add(sqlPrm);
                cmd.CommandText = "SELECT * FROM Inventory WHERE InventoryID=@InventoryId";
                
                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(ds);
                connection.Close();
                return ds;
            }
            catch(Exception ex)
            {
                return ds;
            }
            finally
            {
                if(connection.State == ConnectionState.Open) connection?.Close();
            }

        }
    }
}
