/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import axios from 'axios';

import CONFIG from '../../config.json';

class OAuth extends Component {
  async componentDidMount() {
    const matcher = location.search.replace(/^\?/, '').match(/code=([^&]+)/);
    const code = matcher && matcher[1] ? matcher[1] : null;

    const { data } = await axios.get(
      `https://crossorigin.me/https://github.com/login/oauth/access_token`,
      null,
      {
        headers: {
          Origin: location.host,
        },
        params: {
          code,
          client_id: CONFIG.github_client_id,
          client_secret: CONFIG.github_client_secret,
        },
        withCredentials: true,
      }
    );
    console.log(data);
  }

  render() {
    return <div />;
  }
}
export default OAuth;
