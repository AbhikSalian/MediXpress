using Microsoft.Data.SqlClient;
using System.Data;

namespace OrderService.DAL.Interfaces
{
    public interface IOrderRepository
    {

        string CreateOrder(SqlParameter[] orderParams, out int orderId);
        string AddOrderItem(SqlParameter[] itemParams);

        //string CreateOrder(SqlParameter[] orderParams);
        string UpdateOrderStatus(SqlParameter[] statusParams);
        string DeleteOrder(SqlParameter[] deleteParams);
        DataSet GetOrdersByCustomer(SqlParameter[] customerParams);
        DataSet GetOrdersByStore(SqlParameter[] storeParams);

        DataSet GetOrderItemsByOrderId(SqlParameter sqlprmInvID);
    }
}

