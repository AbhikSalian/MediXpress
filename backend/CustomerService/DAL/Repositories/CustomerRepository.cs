using CustomerService.DAL.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Common;

namespace CustomerService.DAL.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        string connectionString;
        SqlConnection connection;
        public CustomerRepository()
        {
            connectionString = "Data Source=WIN2K22-VM\\SQLEXPRESS;Initial Catalog=MXCustomerDB;Integrated Security=true;TrustServerCertificate=True;User Id=zadmin;Password=Pass@123";
            connection = new SqlConnection(connectionString);
        }


        public string Register(SqlParameter[] customerParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;

                // Ensure Email uniqueness at DB level, but also check in code.
                cmd.CommandText = @"
                IF EXISTS (SELECT 1 FROM Customers WHERE Email = @Email)
                BEGIN
                    SELECT -1; 
                    RETURN;
                END
                INSERT INTO Customers (CustomerName, Email, [Password], Phone, Pincode, [Address], CreatedAt)
                VALUES (@CustomerName, @Email, @Password, @Phone, @Pincode, @Address, @CreatedAt);

                SELECT SCOPE_IDENTITY();";

                cmd.Parameters.AddRange(customerParams);

                connection.Open();
                var result = cmd.ExecuteScalar(); // returns -1 or new identity
                connection.Close();

                if (result != null && int.TryParse(result.ToString(), out int identity))
                {
                    if (identity == -1)
                        return "Email already registered.";
                    return "Success"; // optionally return the new ID
                }

                return "Failed to register.";
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


        public DataSet Login(SqlParameter[] loginParams)
        {
            DataSet ds = new DataSet();
            try
            {
                using SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;

                // NOTE: Plain-text compare (see secure version below)
                cmd.CommandText = @"
                SELECT TOP 1 CustomerID, CustomerName, Email, Phone, Pincode, [Address], CreatedAt
                FROM Customers
                WHERE Email = @Email AND [Password] = @Password;";

                cmd.Parameters.AddRange(loginParams);

                using SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                connection.Open();
                adapter.Fill(ds);
                connection.Close();

                return ds;
            }
            catch
            {
                return ds; // return empty
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }


        public string UpdateCustomer(SqlParameter[] sqlprm)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("UPDATE Customers SET Pincode = @Pincode, Address = @Address WHERE CustomerID = @CustomerID", connection);
                cmd.Parameters.AddRange(sqlprm);

                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                return rowsAffected > 0 ? "Customer updated successfully." : "Update failed.";
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

        public string UpdatePassword(SqlParameter[] passParameters)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand(@"
            IF EXISTS (
                SELECT 1 FROM Customers 
                WHERE CustomerID = @CustomerID AND [Password] = @OldPassword
            )
            BEGIN
                UPDATE Customers SET [Password] = @NewPassword WHERE CustomerID = @CustomerID;
                SELECT 'Success';
            END
            ELSE
            BEGIN
                SELECT 'Invalid old password.';
            END", connection);

                cmd.Parameters.AddRange(passParameters);
                connection.Open();
                var result = cmd.ExecuteScalar()?.ToString();
                connection.Close();

                return result ?? "Update failed.";
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


        public DataSet GetCustomerById(int customerId)
        {
            DataSet ds = new DataSet();
            try
            {
                using SqlCommand cmd = new SqlCommand("SELECT * FROM Customers WHERE CustomerID = @CustomerID", connection);
                cmd.Parameters.AddWithValue("@CustomerID", customerId);

                using SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                connection.Open();
                adapter.Fill(ds);
                connection.Close();
            }
            catch
            {
                return ds;
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
            return ds;
        }

    }
}
