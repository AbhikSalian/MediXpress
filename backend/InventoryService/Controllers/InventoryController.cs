using InventoryService.BusinessLayer;
using InventoryService.DTOs;
using InventoryService.DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace InventoryService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryBO _inventoryBO;

        public InventoryController()
        {
            _inventoryBO = new InventoryBO();
        }

        // POST: api/Inventory
        [HttpPost]
        public IActionResult AddInventory([FromBody] InventoryAddDTO inventoryDto)
        {
            var result = _inventoryBO.AddInventory(inventoryDto);
            if (result == "Success")
                return Ok(new { message = "Inventory added successfully." });
            return BadRequest(new { message = result });
        }

        // GET: api/Inventory/store/5
        [HttpGet("store/{storeId}")]
        public IActionResult GetInventoryByStore(int storeId)
        {
            var inventoryList = _inventoryBO.GetInventoryByStore(storeId);
            //if (inventoryList == null || inventoryList.Count == 0)
            //    return NotFound(new { message = "No inventory found for this store." });
            if (inventoryList == null || inventoryList.Count == 0)
                return Ok(new List<Inventory>()); // Return empty list instead of NotFound
            return Ok(inventoryList);
        }

        // PUT: api/Inventory
        [HttpPut]
        public IActionResult UpdateInventory([FromBody] InventoryDTO inventoryDto)
        {
            var result = _inventoryBO.UpdateInventory(inventoryDto);
            if (result == "Updated successfully.")
                return Ok(new { message = result });
            return BadRequest(new { message = result });
        }

        // DELETE: api/Inventory/5
        [HttpDelete("{inventoryId}")]
        public IActionResult DeleteInventory(int inventoryId)
        {
            var result = _inventoryBO.DeleteInventory(inventoryId);
            if (result == "Deleted successfully.")
                return Ok(new { message = result });
            return BadRequest(new { message = result });
        }

        [HttpGet("inventoryId/{inventoryId}")]
        public IActionResult GetProductId(int inventoryId)
        {
            int productid = _inventoryBO.GetProductID(inventoryId);
            return Ok(productid);
        }



        [HttpPost("reduce-stock")]
        public async Task<IActionResult> ReduceStock([FromBody] StockReductionDTO dto)
        {
            bool success = await _inventoryBO.ReduceStockAsync(dto);
            if (!success)
            {
                return BadRequest($"Failed to reduce stock for ProductID {dto.InventoryID}");
            }

            return Ok($"Stock reduced for ProductID {dto.InventoryID}");
        }

        [HttpGet("inventory/{inventoryId}")]
        public IActionResult GetAction(int inventoryId)
        {
            Inventory inv = _inventoryBO.GetInventory(inventoryId);
            return Ok(inv);
        }
    }
}
