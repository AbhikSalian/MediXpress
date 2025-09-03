using CartService.BusinessLayer;
using CartService.DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace CartService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartBO _bo;

        public CartController()
        {
            _bo = new CartBO();
        }

        // POST: api/cart
        [HttpPost]
        public IActionResult AddItemToCart([FromBody] CartItem item)
        {
            var result = _bo.AddItemToCart(item);
            return Ok(new { message = result });
        }

        // GET: api/cart/{customerId}
        [HttpGet("{customerId}")]
        public IActionResult GetCart(int customerId)
        {
            var items = _bo.GetCart(customerId);
            return Ok(items);
        }

        // PUT: api/cart/{customerId}/product/{productId}/quantity/{quantity}
        [HttpPut("{customerId}/product/{productId}/quantity/{quantity}")]
        public IActionResult UpdateQuantity(int customerId, int productId, int quantity)
        {
            var result = _bo.UpdateQuantity(customerId, productId, quantity);
            return Ok(new { message = result });
        }

        // DELETE: api/cart/{customerId}/product/{productId}
        [HttpDelete("{customerId}/product/{productId}")]
        public IActionResult RemoveItem(int customerId, int productId)
        {
            var result = _bo.RemoveItem(customerId, productId);
            return Ok(new { message = result });
        }

        // DELETE: api/cart/{customerId}/clear
        [HttpDelete("{customerId}/clear")]
        public IActionResult ClearCart(int customerId)
        {
            var result = _bo.ClearCart(customerId);
            return Ok(new { message = result });
        }


    }
}
