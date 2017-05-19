/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import CONFIG from '../../config.json';
import github from '../../lib/github';

import * as oauthActions from '../../redux/oauth';

class OAuth extends Component {
  async componentDidMount() {
    const matcher = location.search.replace(/^\?/, '').match(/code=([^&]+)/);
    const code = matcher && matcher[1] ? matcher[1] : null;
    this.props.setCode({ code });

    const {
      data
    } = await axios.get(
      `https://crossorigin.me/https://github.com/login/oauth/access_token`,
      null,
      {
        headers: {
          Origin: location.host
        },
        params: {
          code,
          client_id: CONFIG.github_client_id,
          client_secret: CONFIG.github_client_secret
        },
        withCredentials: true
      }
    );
    console.log(data);
    // setTimeout(() => {
    //   window.close();
    // }, 100);
  }

  render() {
    return <div />;
  }
}
export default connect(
  function mapStateToProps(state) {
    return { OAUTH: state.OAUTH };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setCode: oauthActions.store
      },
      dispatch
    );
  }
)(OAuth);
