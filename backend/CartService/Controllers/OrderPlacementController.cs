using CartService.BusinessLayer;
using Microsoft.AspNetCore.Mvc;

namespace CartService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderPlacementController : ControllerBase
    {
        private readonly OrderPlacementBO _bo;

        public OrderPlacementController()
        {
            _bo = new OrderPlacementBO();
        }

        [HttpPost("{customerId}/checkout")]
        public async Task<IActionResult> PlaceOrder(int customerId, [FromQuery] int deliveryStatus = 0)
        {
            var result = await _bo.PlaceOrderAsync(customerId, deliveryStatus);
            return Ok(new { message = result });
        }
    }
}