import axios from 'axios';
import { BASE_URL, TIMEOUT } from '../constants/rawg.js';

const rawgClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

rawgClient.interceptors.request.use((config) => {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    throw new Error('RAWG_API_KEY is not defined in the environment.');
  }
  config.params = {
    ...config.params,
    key: apiKey,
  };
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default rawgClient;
