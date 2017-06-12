/**
 * Created by axetroy on 17-6-12.
 */

import axios from 'axios';

export default function(query = '') {
  return function() {
    return axios.post(
      `https://api.github.com/graphql`,
      { query },
      {
        withCredentials: false,
        responseType: 'json',
        headers: {
          Accept: 'application/json;charset=utf-8',
          Authorization: `bearer 436b5cce2a568749d82cee33f7009b71329c7047`
        }
      }
    );
  };
}
