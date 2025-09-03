import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url.com/api', // Replace with your actual API URL
});

export default api;
