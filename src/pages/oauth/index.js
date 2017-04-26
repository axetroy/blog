/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as oauthActions from '../../redux/oauth';

class OAuth extends Component {
  async componentWillMount() {
    const matcher = location.search.replace(/^\?/, '').match(/code=([^&]+)/);
    const code = matcher && matcher[1] ? matcher[1] : null;
    this.props.setCode(code);

    let result;
    try {
      const { data } = await axios.get(
        `https://axetroy.herokuapp.com/oauth?code=${code}`
      );
      result = data;
      if (data && data.access_token) {
        this.props.setAccessToken(data.access_token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      const opener = window.opener;
      opener && opener.onoauth && opener.onoauth(result);
    }
  }

  render() {
    return (
      <div className="text-center">
        <h2>正在登陆...</h2>
        <p>请不要关闭页面</p>
      </div>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      OAUTH: state.OAUTH
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setCode: oauthActions.setCode,
        setAccessToken: oauthActions.setAccessToken
      },
      dispatch
    );
  }
)(OAuth);
