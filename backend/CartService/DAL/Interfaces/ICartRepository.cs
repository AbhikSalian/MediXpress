using Microsoft.Data.SqlClient;
using System.Data;

namespace CartService.DAL.Interfaces
{
    public interface ICartRepository
    {
        string AddItemToCart(SqlParameter[] parameters);
        string RemoveItem(SqlParameter[] parameters);
        string UpdateQuantity(SqlParameter[] parameters);
        string ClearCart(SqlParameter[] parameters);
        DataSet GetCart(SqlParameter[] parameters);
    }
}
