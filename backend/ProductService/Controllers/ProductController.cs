using Microsoft.AspNetCore.Mvc;
using ProductService.BusinessLayer;
using ProductService.DAL.Models;
using ProductService.DTOs;
using System.Collections.Generic;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductBO _productBO;

        public ProductController(ProductBO productBO)
        {
            _productBO = productBO;
        }

        // POST: api/Product/Create
        [HttpPost("Create")]
        public IActionResult CreateProduct([FromBody] ProductDTO newProduct)
        {
            string result = _productBO.CreateProduct(newProduct);
            if (result == "Success")
                return Ok(new { Message = "Product created successfully." });

            return BadRequest(new { Error = result });
        }

        // PUT: api/Product/Update/{id}
        [HttpPut("Update/{id:int}")]
        public IActionResult UpdateProduct([FromRoute] int id, [FromBody] ProductDTO updatedProduct)
        {
            string result = _productBO.UpdateProduct(id, updatedProduct);
            if (result == "Success")
                return Ok(new { Message = "Product updated successfully." });

            // Keep same pattern as CustomerController (BadRequest on non-success)
            return BadRequest(new { Error = result });
        }

        // DELETE: api/Product/Delete/{id}
        [HttpDelete("Delete/{id:int}")]
        public IActionResult DeleteProduct([FromRoute] int id)
        {
            string result = _productBO.DeleteProduct(id);
            if (result == "Success")
                return Ok(new { Message = "Product deleted successfully." });

            return BadRequest(new { Error = result });
        }

        // GET: api/Product/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetProductById([FromRoute] int id)
        {
            Product? product = _productBO.GetProductById(id);
            if (product == null)
                return NotFound(new { Error = "Product not found." });

            return Ok(product);
        }

        // GET: api/Product
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            List<Product> products = _productBO.GetAllProducts();
            return Ok(products);
        }

        // GET: api/Product/ByCategory/{category}
        [HttpGet("ByCategory/{category}")]
        public IActionResult GetProductsByCategory([FromRoute] string category)
        {
            if (string.IsNullOrWhiteSpace(category))
                return BadRequest(new { Error = "Category is required." });

            List<Product> products = _productBO.GetProductsByCategory(category);
            return Ok(products);
        }

    }
}
