import axios from 'axios';

const api = axios.create({
  baseURL: 'https://controle-estoque-xm8r.onrender.com/api',
});

export default api;