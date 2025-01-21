import axios from 'axios';

const api = axios.create({
  baseURL: 'http://todo-blockchain-lovat.vercel.app',  
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

export default api;