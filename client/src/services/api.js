import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/https://todo-blockchain-server.vercel.app',  
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

export default api;