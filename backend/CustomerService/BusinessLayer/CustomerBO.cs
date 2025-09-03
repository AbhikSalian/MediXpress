using CustomerService.DAL.Interfaces;
using CustomerService.DAL.Models;
using CustomerService.DAL.Repositories;
using CustomerService.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CustomerService.BusinessLayer
{
    public class CustomerBO
    {


        private readonly ICustomerRepository _repo;

        public CustomerBO()
        {
            _repo = new CustomerRepository();
        }

        // RegisterCustomer(Customer newCustomer)
        public string RegisterCustomer(CustomerDTO newCustomer)
        {
            if (newCustomer == null) return "Customer cannot be null";
            if (string.IsNullOrWhiteSpace(newCustomer.Email)) return "Email is required";
            if (string.IsNullOrWhiteSpace(newCustomer.Password)) return "Password is required";
            if (string.IsNullOrWhiteSpace(newCustomer.CustomerName)) return "CustomerName is required";
            if (string.IsNullOrWhiteSpace(newCustomer.Pincode)) return "Pincode is required";
            if (string.IsNullOrWhiteSpace(newCustomer.Address)) return "Address is required";

            // Set CreatedAt if not set
            DateTime currDate = DateTime.Now;

            // Build SQL parameters
            SqlParameter[] parameters = new SqlParameter[7];
            parameters[0] = new SqlParameter("@CustomerName", newCustomer.CustomerName ?? (object)DBNull.Value);
            parameters[1] = new SqlParameter("@Email", newCustomer.Email);
            parameters[2] = new SqlParameter("@Password", newCustomer.Password!); // Plain password (see secure version below)
            parameters[3] = new SqlParameter("@Phone", (object?)newCustomer.Phone ?? DBNull.Value);
            parameters[4] = new SqlParameter("@Pincode", newCustomer.Pincode!);
            parameters[5] = new SqlParameter("@Address", newCustomer.Address!);
            parameters[6] = new SqlParameter("@CreatedAt", currDate);

            string result = _repo.Register(parameters);
            return result;
        }

        // LoginCustomer(email, password) -> returns Customer or null
        public Customer? LoginCustomer(string email, string password)
        {
            SqlParameter[] loginParams = new SqlParameter[2];
            loginParams[0] = new SqlParameter("@Email", email);
            loginParams[1] = new SqlParameter("@Password", password);

            DataSet ds = _repo.Login(loginParams);
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0) return null;

            DataRow row = ds.Tables[0].Rows[0];
            Customer customer = new Customer
            {
                CustomerID = Convert.ToInt32(row["CustomerID"]),
                CustomerName = row["CustomerName"]?.ToString(),
                Email = row["Email"]?.ToString()!,
                Phone = row["Phone"]?.ToString(),
                Pincode = row["Pincode"]?.ToString(),
                Address = row["Address"]?.ToString(),
                CreatedAt = Convert.ToDateTime(row["CreatedAt"]),
                // Don't populate Password on login result
            };
            return customer;
        }


        public string UpdateCustomer(UpdateCustomerDTO dto)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@CustomerID", dto.CustomerId),
                new SqlParameter("@Pincode", dto.PinCode ?? (object)DBNull.Value),
                new SqlParameter("@Address", dto.Address ?? (object)DBNull.Value)
            };

            return _repo.UpdateCustomer(parameters);
        }


        public string UpdatePassword(UpdatePasswordDTO dto)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
        new SqlParameter("@CustomerID", dto.CustomerID),
        new SqlParameter("@OldPassword", dto.OldPassword ?? (object)DBNull.Value),
        new SqlParameter("@NewPassword", dto.NewPassword ?? (object)DBNull.Value)
            };

            return _repo.UpdatePassword(parameters);
        }

        public Customer? GetCustomerById(int customerId)
        {
            DataSet ds = _repo.GetCustomerById(customerId);
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0) return null;

            DataRow row = ds.Tables[0].Rows[0];
            return new Customer
            {
                CustomerID = Convert.ToInt32(row["CustomerID"]),
                CustomerName = row["CustomerName"]?.ToString(),
                Email = row["Email"]?.ToString(),
                Phone = row["Phone"]?.ToString(),
                Pincode = row["Pincode"]?.ToString(),
                Address = row["Address"]?.ToString(),
                CreatedAt = Convert.ToDateTime(row["CreatedAt"])
            };
        }

    }



}

