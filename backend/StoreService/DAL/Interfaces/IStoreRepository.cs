using Microsoft.Data.SqlClient;
using StoreService.DAL.Models;
using System.Data;

namespace StoreService.DAL.Interfaces
{
    public interface IStoreRepository
    {

        string Register(SqlParameter[] parameters);
        DataSet Login(SqlParameter[] parameters);

        List<Store> GetAllStores();
        List<Store> GetStoresByPincode(SqlParameter pinParam);
        DataSet GetStore(SqlParameter sqlstoreid);

    }
}
