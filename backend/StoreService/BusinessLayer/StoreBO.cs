using Microsoft.Data.SqlClient;
using StoreService.DAL.Interfaces;
using StoreService.DAL.Models;
using StoreService.DAL.Repositories;
using StoreService.DTOs;
using System.Data;

namespace StoreService.BusinessLayer
{
    public class StoreBO
    {
        private readonly IStoreRepository _repo;
        public StoreBO()
        {
            _repo = new StoreRepository();
        }


        public string RegisterStore(StoreDTO newStore)
        {
            if (newStore == null) return "Store cannot be null";
            if (string.IsNullOrWhiteSpace(newStore.Email)) return "Email is required";
            if (string.IsNullOrWhiteSpace(newStore.Password)) return "Password is required";
            if (string.IsNullOrWhiteSpace(newStore.StoreName)) return "StoreName is required";
            if (string.IsNullOrWhiteSpace(newStore.Pincode)) return "Pincode is required";
            if (string.IsNullOrWhiteSpace(newStore.Address)) return "Address is required";

            DateTime currDate = DateTime.Now;

            SqlParameter[] parameters = new SqlParameter[7];
            parameters[0] = new SqlParameter("@StoreName", newStore.StoreName ?? (object)DBNull.Value);
            parameters[1] = new SqlParameter("@Email", newStore.Email);
            parameters[2] = new SqlParameter("@Password", newStore.Password!);
            parameters[3] = new SqlParameter("@Phone", (object?)newStore.Phone ?? DBNull.Value);
            parameters[4] = new SqlParameter("@Pincode", newStore.Pincode!);
            parameters[5] = new SqlParameter("@Address", newStore.Address!);
            parameters[6] = new SqlParameter("@CreatedAt", currDate);

            string result = _repo.Register(parameters);
            return result;
        }

        // LoginStore(email, password) -> returns Store or null
        public Store? LoginStore(string email, string password)
        {
            SqlParameter[] loginParams = new SqlParameter[2];
            loginParams[0] = new SqlParameter("@Email", email);
            loginParams[1] = new SqlParameter("@Password", password);

            DataSet ds = _repo.Login(loginParams);
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0) return null;

            DataRow row = ds.Tables[0].Rows[0];
            Store store = new Store
            {
                StoreID = Convert.ToInt32(row["StoreID"]),
                StoreName = row["StoreName"]?.ToString(),
                Email = row["Email"]?.ToString()!,
                Phone = row["Phone"]?.ToString(),
                Pincode = row["Pincode"]?.ToString(),
                Address = row["Address"]?.ToString(),
                CreatedAt = Convert.ToDateTime(row["CreatedAt"]),
                // Don't populate Password on login result
            };
            return store;
        }


        public List<Store> GetAllStores()
        {
            return _repo.GetAllStores();
        }

        public List<Store> GetStoresByPincode(string pincode)
        {
            SqlParameter pinParam = new SqlParameter("@Pincode", pincode);
            return _repo.GetStoresByPincode(pinParam);
        }

        public Store GetStore(int storeid)
        {
            SqlParameter sqlprm = new SqlParameter("@StoreId",storeid);
            DataSet ds = _repo.GetStore(sqlprm);  
            DataRow row = ds.Tables[0].Rows[0];
            Store store = new Store
            {
                StoreID = Convert.ToInt32(row["StoreID"]),
                StoreName = row["StoreName"]?.ToString(),
                Email = row["Email"]?.ToString()!,
                Phone = row["Phone"]?.ToString(),
                Pincode = row["Pincode"]?.ToString(),
                Address = row["Address"]?.ToString(),
                CreatedAt = Convert.ToDateTime(row["CreatedAt"]),
                // Don't populate Password on login result
            };
            return store;

        }
    }
}
