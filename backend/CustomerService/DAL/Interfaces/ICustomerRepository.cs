using Microsoft.Data.SqlClient;
using System.Data;

namespace CustomerService.DAL.Interfaces
{
    public interface ICustomerRepository
    {

        string Register(SqlParameter[] customerParams);

        
        DataSet Login(SqlParameter[] loginParams);

        string UpdateCustomer(SqlParameter[] sqlprm);

        string UpdatePassword(SqlParameter[] passParameters);

        DataSet GetCustomerById(int customerId);

    }
}
