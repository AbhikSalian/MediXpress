using CustomerService.BusinessLayer;
using CustomerService.DAL.Models;
using CustomerService.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerService.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class CustomerController : ControllerBase
    {
        private readonly CustomerBO _customerBO;
        public CustomerController(CustomerBO customerBO)
        {
            _customerBO = customerBO;
        }

        [HttpPost("Register")]
        public IActionResult RegisterCustomer([FromBody] CustomerDTO newCustomer)
        {
            string result = _customerBO.RegisterCustomer(newCustomer);
            if (result == "Success")
                return Ok(new { Message = "Customer registered successfully." });
            else
                return BadRequest(new { Error = result });
        }

        // POST: api/Customer/Login
        [HttpPost("Login")]
        public IActionResult LoginCustomer([FromBody] LoginRequestDTO login)
        {
            var customer = _customerBO.LoginCustomer(login.Email, login.Password);
            if (customer == null)
                return Unauthorized(new { Error = "Invalid email or password." });

            return Ok(customer);
        }


        [HttpPut("update")]
        public IActionResult UpdateCustomer([FromBody] UpdateCustomerDTO dto)
        {
            var result = _customerBO.UpdateCustomer(dto);
            return Ok(new { message = result });
        }


        [HttpPut("update-password")]
        public IActionResult UpdatePassword([FromBody] UpdatePasswordDTO dto)
        {
            var result = _customerBO.UpdatePassword(dto);
            return Ok(new { message = result });
        }


        [HttpGet("{id}")]
        public IActionResult GetCustomerById(int id)
        {
            var customer = _customerBO.GetCustomerById(id);
            if (customer == null)
                return NotFound(new { Message = "Customer not found." });
            return Ok(customer);
        }

    }

    }
