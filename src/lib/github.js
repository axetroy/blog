/**
 * Created by axetroy on 2017/4/7.
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  // timeout: 1000 * 10,
  params: {
    client_id: 'b8257841dd7ca5eef2aa',
    client_secret: '4da33dd6fcb0a01d395945ad18613ecf9c12079e'
  },
  withCredentials: false,
  responseType: 'json',
  headers: { Accept: 'application/json' }
});

instance.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

axiosRetry(instance, { retries: 3 });

export default instance;
