/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Row, Col } from 'antd';
import pkg from '../../../package.json';
import github from '../../lib/github';

import { store } from '../../redux/about';

class About extends Component {
  componentDidMount() {
    const { owner, repo } = pkg.config;
    this.getAbout(owner, repo);
  }

  async getAbout(owner, repo) {
    let html = '';
    try {
      const response = await github.get(
        `/repos/${owner}/${repo}/contents/ABOUTME.md`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      html = response.data;
    } catch (err) {
      console.error(err);
    }
    this.storeAboutMe(html);
    return html;
  }

  storeAboutMe() {
    return this.props.storeAboutMe(...arguments);
  }

  render() {
    return (
      <Row>
        <Col span={16} offset={4}>
          <Spin spinning={!this.props.aboutMe}>
            <div dangerouslySetInnerHTML={{ __html: this.props.aboutMe }} />
          </Spin>
        </Col>
      </Row>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { aboutMe: state.aboutMe };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeAboutMe: store
      },
      dispatch
    );
  }
)(About);
