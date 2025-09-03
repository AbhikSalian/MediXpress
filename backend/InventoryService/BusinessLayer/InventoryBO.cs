using InventoryService.DAL.Interfaces;
using InventoryService.DAL.Models;
using InventoryService.DAL.Repositories;
using InventoryService.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;
using static InventoryService.BusinessLayer.InventoryBO;

namespace InventoryService.BusinessLayer
{
    public class InventoryBO
    {

        private readonly IInventoryRepository _repo;

        public InventoryBO()
        {
            _repo = new InventoryRepository();
        }

        // AddInventory(InventoryDTO newInventory)
        public string AddInventory(InventoryAddDTO newInventory)
        {
            if (newInventory == null) return "Inventory cannot be null";
            if (newInventory.StoreID <= 0) return "Invalid StoreID";
            if (newInventory.ProductID <= 0) return "Invalid ProductID";
            if (newInventory.UnitPrice < 0) return "UnitPrice must be non-negative";
            if (newInventory.DiscountRate < 0 || newInventory.DiscountRate > 100) return "DiscountRate must be between 0 and 100";
            if (newInventory.QuantityInStock < 0) return "QuantityInStock must be non-negative";

            DateTime createdAt = DateTime.Now;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@StoreID", newInventory.StoreID),
                new SqlParameter("@ProductID", newInventory.ProductID),
                new SqlParameter("@UnitPrice", newInventory.UnitPrice),
                new SqlParameter("@DiscountRate", newInventory.DiscountRate),
                new SqlParameter("@QuantityInStock", newInventory.QuantityInStock),
                new SqlParameter("@CreatedAt", createdAt)
            };

            return _repo.AddInventory(parameters);
        }

        // GetInventoryByStore(int storeId)
        public List<Inventory> GetInventoryByStore(int storeId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@StoreID", storeId)
            };

            DataSet ds = _repo.GetInventoryByStore(parameters);
            List<Inventory> inventoryList = new List<Inventory>();

            if (ds.Tables.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    Inventory inv = new Inventory
                    {
                        InventoryID = Convert.ToInt32(row["InventoryID"]),
                        StoreID = Convert.ToInt32(row["StoreID"]),
                        ProductID = Convert.ToInt32(row["ProductID"]),
                        UnitPrice = Convert.ToDecimal(row["UnitPrice"]),
                        DiscountRate = Convert.ToDecimal(row["DiscountRate"]),
                        QuantityInStock = Convert.ToInt32(row["QuantityInStock"]),
                        CreatedAt = Convert.ToDateTime(row["CreatedAt"])
                    };
                    inventoryList.Add(inv);
                }
            }

            return inventoryList;
        }

        // UpdateInventory(InventoryDTO updatedInventory)
        public string UpdateInventory(InventoryDTO updatedInventory)
        {
            if (updatedInventory.InventoryID <= 0) return "Invalid InventoryID";
            if (updatedInventory.UnitPrice < 0) return "UnitPrice must be non-negative";
            if (updatedInventory.DiscountRate < 0 || updatedInventory.DiscountRate > 100) return "DiscountRate must be between 0 and 100";
            if (updatedInventory.QuantityInStock < 0) return "QuantityInStock must be non-negative";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@InventoryID", updatedInventory.InventoryID),
                new SqlParameter("@UnitPrice", updatedInventory.UnitPrice),
                new SqlParameter("@DiscountRate", updatedInventory.DiscountRate),
                new SqlParameter("@QuantityInStock", updatedInventory.QuantityInStock)
            };

            return _repo.UpdateInventory(parameters);
        }

        // DeleteInventory(int inventoryId)
        public string DeleteInventory(int inventoryId)
        {
            if (inventoryId <= 0) return "Invalid InventoryID";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@InventoryID", inventoryId)
            };

            return _repo.DeleteInventory(parameters);
        }

        public int GetProductID(int inventoryId)
        {
            DataSet ds = new DataSet();

            SqlParameter sqlprm = new SqlParameter("@inventorytID", inventoryId);

            ds = _repo.GetProductID(sqlprm);
            DataRow row = ds.Tables[0].Rows[0];
            int productId = Convert.ToInt32(row["ProductID"]);

            return productId;
        }


        public async Task<bool> ReduceStockAsync(StockReductionDTO dto)
        {
            var parameters = new[]
            {
                    new SqlParameter("@InventoryID", dto.InventoryID),
                    new SqlParameter("@QuantityToReduce", dto.QuantityToReduce)
                };

            return await _repo.ReduceStockAsync(parameters);
        }

        

        public Inventory GetInventory(int inventoryId)
        {
            SqlParameter sqlprm = new SqlParameter("@InventoryId", inventoryId);
            DataSet ds = new DataSet();
            ds = _repo.GetInventory(sqlprm);
            if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                Inventory invv = new Inventory();
                return invv;
            }
            else
            {
                DataRow row = ds.Tables[0].Rows[0];
                Inventory inv = new Inventory
                {
                    InventoryID = Convert.ToInt32(row["InventoryID"]),
                    StoreID = Convert.ToInt32(row["StoreID"]),
                    ProductID = Convert.ToInt32(row["ProductID"]),
                    UnitPrice = Convert.ToDecimal(row["UnitPrice"]),
                    DiscountRate = Convert.ToDecimal(row["DiscountRate"]),
                    QuantityInStock = Convert.ToInt32(row["QuantityInStock"]),
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"])
                };
                return inv;
            }
            
        }
    }
}


