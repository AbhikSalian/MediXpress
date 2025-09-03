import { customerApi } from './api';

export const customerService = {
  getCustomerById: async (customerId) => {
    try {
      const response = await customerApi.get(`/api/Customer/${customerId}`);
      const customer = response.data;
      return {
        id: customer.customerID || customer.customerId,
        name: customer.customerName,
        phone: customer.phone,
        address: customer.address,
        pincode: customer.pincode
      };
    } catch (error) {
      console.error(`Failed to fetch customer ${customerId}`, error);
      return { id: customerId, name: `Customer ${customerId}`, address: 'N/A', phone: 'N/A' };
    }
  }
};