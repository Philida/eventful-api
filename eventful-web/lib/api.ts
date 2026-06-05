import axios from 'axios';

export const api = axios.create({
  baseURL:
    'https://eventful-api-93g8.onrender.com',
});