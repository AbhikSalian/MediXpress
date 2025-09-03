using Microsoft.Data.SqlClient;
using System.Data;


namespace ProductService.DAL.Interfaces
{
    public interface IProductRepository
    {

        string Create(SqlParameter[] productParams);
        string Update(SqlParameter[] productParams);
        string Delete(SqlParameter[] keyParams);
        List<Models.Product> GetAllProducts();
        Models.Product? GetProductById(int id);
        List<Models.Product> GetProductsByCategory(string category);




    }
}
