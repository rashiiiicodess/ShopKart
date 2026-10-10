import axios from 'axios';

const API = axios.create({
  baseURL: 'https://shop-kart-mauve-one.vercel.app/',
  withCredentials: true, 
});

export default API;