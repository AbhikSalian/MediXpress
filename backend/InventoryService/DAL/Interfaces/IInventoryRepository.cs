using Microsoft.Data.SqlClient;
using System.Data;

namespace InventoryService.DAL.Interfaces
{
    public interface IInventoryRepository
    {

        string AddInventory(SqlParameter[] inventoryParams);
        DataSet GetInventoryByStore(SqlParameter[] storeParams);
        string UpdateInventory(SqlParameter[] updateParams);
        string DeleteInventory(SqlParameter[] deleteParams);
        DataSet GetProductID(SqlParameter sqlprmInvID);
        Task<bool> ReduceStockAsync(SqlParameter[] parameters);
        DataSet GetInventory(SqlParameter sqlPrm);
    }
}
