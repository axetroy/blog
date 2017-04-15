/**
 * Created by axetroy on 2017/4/7.
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';
import pkg from '../../package.json';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  // timeout: 1000 * 10,
  params: {
    client_id: pkg.config.github_client_id,
    client_secret: pkg.config.github_client_secret
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
