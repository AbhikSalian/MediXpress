using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using ProductService.DAL.Interfaces;
using ProductService.DAL.Repositories;
using ProductService.DAL.Models;
using ProductService.DTOs;


namespace ProductService.BusinessLayer
{
    public class ProductBO
    {
        private readonly IProductRepository _repo;

        public ProductBO()
        {
            _repo = new ProductRepository();
        }
        public string CreateProduct(ProductDTO newProduct)
        {
            if (newProduct == null) return "Product cannot be null";
            if (string.IsNullOrWhiteSpace(newProduct.ProductName)) return "ProductName is required";
            if (string.IsNullOrWhiteSpace(newProduct.Description)) return "Description is required";
            if (string.IsNullOrWhiteSpace(newProduct.Category)) return "Category is required";

            var name = newProduct.ProductName!.Trim();
            var desc = newProduct.Description!.Trim();
            var cat = newProduct.Category!.Trim();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductName", name),
                new SqlParameter("@Description", desc),
                new SqlParameter("@Category",   cat),
                new SqlParameter("@CreatedAt",  DateTime.Now)
            };

            return _repo.Create(parameters);
        }
        public string UpdateProduct(int productId, ProductDTO updatedProduct)
        {
            if (productId <= 0) return "ProductID is required";
            if (updatedProduct == null) return "Product cannot be null";
            if (string.IsNullOrWhiteSpace(updatedProduct.ProductName)) return "ProductName is required";
            if (string.IsNullOrWhiteSpace(updatedProduct.Description)) return "Description is required";
            if (string.IsNullOrWhiteSpace(updatedProduct.Category)) return "Category is required";

            var name = updatedProduct.ProductName!.Trim();
            var desc = updatedProduct.Description!.Trim();
            var cat = updatedProduct.Category!.Trim();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductID",   productId),
                new SqlParameter("@ProductName", name),
                new SqlParameter("@Description", desc),
                new SqlParameter("@Category",    cat)
            };

            return _repo.Update(parameters);
        }
        public string DeleteProduct(int productId)
        {
            if (productId <= 0) return "ProductID is required";

            var parameters = new[]
            {
                new SqlParameter("@ProductID", productId)
            };

            return _repo.Delete(parameters);
        }
        public Product? GetProductById(int id)
        {
            if (id <= 0) return null;
            return _repo.GetProductById(id);
        }
        public List<Product> GetAllProducts()
        {
            return _repo.GetAllProducts();
        }
        public List<Product> GetProductsByCategory(string category)
        {
            if (string.IsNullOrWhiteSpace(category)) return new List<Product>();
            return _repo.GetProductsByCategory(category.Trim());
        }



    }
}
