using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using ProductService.DAL.Interfaces;
using ProductService.DAL.Models;


namespace ProductService.DAL.Repositories
{
    public class ProductRepository:IProductRepository
    {
        string connectionString;
        SqlConnection connection;
        public ProductRepository()
        {
            connectionString = "Data Source=WIN2K22-VM\\SQLEXPRESS;Initial Catalog=MXProductsDB;Integrated Security=true;TrustServerCertificate=True;User Id=zadmin;Password=Pass@123";
            connection = new SqlConnection(connectionString);
        }
        public string Create(SqlParameter[] productParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;

                
                cmd.CommandText = @"
                IF EXISTS (SELECT 1 FROM ProductsTable WHERE ProductName = @ProductName AND Category = @Category)
                BEGIN
                    SELECT -1; 
                    RETURN;
                END

                INSERT INTO ProductsTable (ProductName, [Description], Category, CreatedAt)
                VALUES (@ProductName, @Description, @Category, @CreatedAt);

                SELECT SCOPE_IDENTITY();";

                cmd.Parameters.AddRange(productParams);

                connection.Open();
                var result = cmd.ExecuteScalar(); 
                connection.Close();

                if (result != null && int.TryParse(result.ToString(), out int identity))
                {
                    if (identity == -1)
                        return "Duplicate product.";
                    return "Success";
                }

                return "Failed to create product.";
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
        public string Update(SqlParameter[] productParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;

                cmd.CommandText = @"
                UPDATE ProductsTable
                SET ProductName = @ProductName,
                    [Description] = @Description,
                    Category = @Category
                WHERE ProductID = @ProductID;";

                cmd.Parameters.AddRange(productParams);

                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();

                return rows > 0 ? "Success" : "Not found";
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
        public string Delete(SqlParameter[] keyParams)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;

                cmd.CommandText = @"DELETE FROM ProductsTable WHERE ProductID = @ProductID;";

                cmd.Parameters.AddRange(keyParams);

                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();

                return rows > 0 ? "Success" : "Not found";
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
        public List<Product> GetAllProducts()
        {
            var products = new List<Product>();
            try
            {
                using var cmd = new SqlCommand(@"
                    SELECT ProductID, ProductName, [Description], Category, CreatedAt
                    FROM ProductsTable
                    ORDER BY CreatedAt DESC;", connection);

                connection.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    products.Add(MapProduct(reader));
                }
                connection.Close();

                return products;
            }
            catch
            {
                return products; 
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }


        public Product? GetProductById(int id)
        {
            try
            {
                using var cmd = new SqlCommand(@"
                    SELECT TOP 1 ProductID, ProductName, [Description], Category, CreatedAt
                    FROM ProductsTable
                    WHERE ProductID = @ProductID;", connection);

                cmd.Parameters.Add(new SqlParameter("@ProductID", id));

                connection.Open();
                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var product = MapProduct(reader);
                    connection.Close();
                    return product;
                }
                connection.Close();
                return null;
            }
            catch
            {
                return null;
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }
        public List<Product> GetProductsByCategory(string category)
        {
            var products = new List<Product>();
            try
            {
                using var cmd = new SqlCommand(@"
                    SELECT ProductID, ProductName, [Description], Category, CreatedAt
                    FROM ProductsTable
                    WHERE Category = @Category
                    ORDER BY CreatedAt DESC;", connection);

                cmd.Parameters.Add(new SqlParameter("@Category", category));

                connection.Open();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    products.Add(MapProduct(reader));
                }
                connection.Close();

                return products;
            }
            catch
            {
                return products; 
            }
            finally
            {
                if (connection.State == ConnectionState.Open) connection.Close();
            }
        }
        private static Product MapProduct(SqlDataReader reader)
        {
            int iProductID = reader.GetOrdinal("ProductID");
            int iProductName = reader.GetOrdinal("ProductName");
            int iDesc = reader.GetOrdinal("Description");
            int iCategory = reader.GetOrdinal("Category");
            int iCreatedAt = reader.GetOrdinal("CreatedAt");

            return new Product
            {
                ProductID = reader.GetInt32(iProductID),
                ProductName = reader.IsDBNull(iProductName) ? null : reader.GetString(iProductName),
                Description = reader.IsDBNull(iDesc) ? null : reader.GetString(iDesc),
                Category = reader.IsDBNull(iCategory) ? null : reader.GetString(iCategory),
                CreatedAt = reader.GetDateTime(iCreatedAt)
            };
        }





    }
}
