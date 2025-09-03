using Microsoft.Data.SqlClient;
using StoreService.DAL.Interfaces;
using StoreService.DAL.Models;
using System.Data;

namespace StoreService.DAL.Repositories
{
    public class StoreRepository : IStoreRepository
    {
        string connectionString;
        SqlConnection connection;
        public StoreRepository()
        {
            connectionString = "Data Source=WIN2K22-VM\\SQLEXPRESS;Initial Catalog=MXStoreDB;Integrated Security=true;TrustServerCertificate=True;User Id=zadmin;Password=Pass@123";
            connection = new SqlConnection(connectionString);

        }

        public string Register(SqlParameter[] parameters)
        {
            try
            {
                connection.Open();

                // Check if email already exists
                using (SqlCommand checkCmd = new SqlCommand("SELECT COUNT(*) FROM Stores WHERE Email = @Email", connection))
                {
                    checkCmd.Parameters.AddWithValue("@Email", parameters[1].Value);
                    int count = (int)checkCmd.ExecuteScalar();
                    if (count > 0)
                    {
                        return "Email already exists";
                    }
                }

                // Insert new store
                using (SqlCommand insertCmd = new SqlCommand("INSERT INTO Stores (StoreName, Email, Password, Phone, Pincode, Address, CreatedAt) " +
                                                             "VALUES (@StoreName, @Email, @Password, @Phone, @Pincode, @Address, @CreatedAt)", connection))
                {
                    insertCmd.Parameters.AddRange(parameters);
                    int rowsAffected = insertCmd.ExecuteNonQuery();
                    return rowsAffected > 0 ? "Success" : "Failed to register store.";
                }
            }
            catch (SqlException ex)
            {
                return $"SQL Error: {ex.Message}";
            }
            finally
            {
                connection.Close();
            }
        }
        public DataSet Login(SqlParameter[] parameters)
        {
            DataSet ds = new DataSet();
            try
            {
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Stores WHERE Email = @Email AND Password = @Password", connection))
                {
                    cmd.Parameters.AddRange(parameters);
                    using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                    {
                        adapter.Fill(ds);
                    }
                }
            }
            catch (SqlException ex)
            {
                // Optionally log error
            }
            return ds;
        }


        public List<Store> GetAllStores()
        {
            List<Store> stores = new List<Store>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Stores", connection))
                {
                    connection.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            stores.Add(new Store
                            {
                                StoreID = Convert.ToInt32(reader["StoreID"]),
                                StoreName = reader["StoreName"].ToString(),
                                Email = reader["Email"].ToString(),
                                Phone = reader["Phone"].ToString(),
                                Pincode = reader["Pincode"].ToString(),
                                Address = reader["Address"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
                            });
                        }
                    }
                }
            }
            catch (SqlException)
            {
                // Handle or log error
            }
            finally
            {
                connection.Close();
            }
            return stores;
        }

        public List<Store> GetStoresByPincode(SqlParameter pinParam)
        {
            List<Store> stores = new List<Store>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Stores WHERE Pincode = @Pincode", connection))
                {
                    cmd.Parameters.Add(pinParam);
                    connection.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            stores.Add(new Store
                            {
                                StoreID = Convert.ToInt32(reader["StoreID"]),
                                StoreName = reader["StoreName"].ToString(),
                                Email = reader["Email"].ToString(),
                                Phone = reader["Phone"].ToString(),
                                Pincode = reader["Pincode"].ToString(),
                                Address = reader["Address"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
                            });
                        }
                    }
                }
            }
            catch (SqlException)
            {
                // Handle or log error
            }
            finally
            {
                connection.Close();
            }
            return stores;
        }

        public DataSet GetStore(SqlParameter sqlstoreid)
        {
            DataSet store = new DataSet();
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Parameters.Add(sqlstoreid);
                cmd.CommandText = "SELECT * FROM Stores WHERE StoreID=@StoreId";
                cmd.Connection = connection;

                connection.Open();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(store);
                connection.Close() ;

                return store;   
            }
            catch (Exception e)
            {
                return store;
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }
    }
}
