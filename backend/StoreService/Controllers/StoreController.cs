using Microsoft.AspNetCore.Mvc;
using StoreService.BusinessLayer;
using StoreService.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using StoreService.DAL.Models;

namespace StoreService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly StoreBO _storeBO;

        public StoreController()
        {
            _storeBO = new StoreBO();
        }

        // POST: api/Store/Register
        [HttpPost("Register")]
        public IActionResult RegisterStore([FromBody] StoreDTO newStore)
        {
            string result = _storeBO.RegisterStore(newStore);
            if (result == "Success")
                return Ok(new { Message = "Store registered successfully." });
            else
                return BadRequest(new { Error = result });
        }

        // POST: api/Store/Login
        [HttpPost("Login")]
        public IActionResult LoginStore([FromBody] LoginRequestDTO login)
        {
            var store = _storeBO.LoginStore(login.Email, login.Password);
            if (store == null)
                return Unauthorized(new { Error = "Invalid email or password." });

            return Ok(store);
        }

        // GET: api/Store/All
        [HttpGet("All")]
        public IActionResult GetAllStores()
        {
            var stores = _storeBO.GetAllStores();
            return Ok(stores);
        }

        // GET: api/Store/ByPincode/{pin}
        [HttpGet("ByPincode/{pin}")]
        public IActionResult GetStoresByPincode(string pin)
        {
            var stores = _storeBO.GetStoresByPincode(pin);
            if (stores.Count == 0)
                return NotFound(new { Message = "No stores found for the given pincode." });

            return Ok(stores);
        }
        [HttpGet("store/{storeid}")]
        public IActionResult GetStore(int storeid)
        {
            Store store = _storeBO.GetStore(storeid);
            return Ok(store);
        }
    }
}
