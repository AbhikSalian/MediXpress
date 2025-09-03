using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderService.BusinessLayer;
using OrderService.DAL.Models;
using OrderService.DTOs;
using System.Data;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderBO _bo;

        public OrderController()
        {
            _bo = new OrderBO();
        }


        [HttpPost("place")]
        public IActionResult PlaceOrder([FromBody] OrderRequestDTO dto)
        {
            var result = _bo.PlaceOrder(dto);
            return Ok(new { message = result });
        }


        [HttpPut("{orderId}/status/{status}")]
        public IActionResult UpdateOrderStatus(int orderId, int status)
        {
            var result = _bo.UpdateOrderStatus(orderId, status);
            return result == "Updated successfully." ? Ok(new { message = result }) : BadRequest(new { message = result });
        }

        [HttpDelete("{orderId}")]
        public IActionResult DeleteOrder(int orderId)
        {
            var result = _bo.DeleteOrder(orderId);
            return result == "Deleted successfully." ? Ok(new { message = result }) : BadRequest(new { message = result });
        }

        [HttpGet("customer/{customerId}")]
        public IActionResult GetOrdersByCustomer(int customerId)
        {
            List<OrderDTO> ds = _bo.GetOrdersByCustomer(customerId);
            return Ok(ds);
        }

        [HttpGet("store/{storeId}")]
        public IActionResult GetOrdersByStore(int storeId)
        {
            List<OrderDTO> ds = _bo.GetOrdersByStore(storeId);
            return Ok(ds);
        }

        [HttpGet("orderItem/{orderId}")]
        public IActionResult GetOrderItems(int orderId)
        {
            List<OrderItem> ds = _bo.GetOrderItems(orderId);
            return Ok(ds);
        }
    }
}


