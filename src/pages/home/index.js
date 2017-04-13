/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin } from 'antd';

import pkg from '../../../package.json';
import github from '../../lib/github';
import { store } from '../../redux/homeReadMe';

class Home extends Component {
  async componentDidMount() {
    const { owner, repo } = pkg.config;
    await this.getReadme(owner, repo);
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  storeReadme() {
    return this.props.storeReadMe(...arguments);
  }

  async getReadme(owner, repo) {
    let html = '';
    try {
      const response = await github.get(`/repos/${owner}/${repo}/readme`, {
        headers: {
          Accept: 'application/vnd.github.v3.html'
        },
        responseType: 'text'
      });
      html = response.data;
    } catch (err) {
      console.error(err);
    }
    this.storeReadme(html);
    return html;
  }

  render() {
    return (
      <Row>
        <Col span={16} offset={4}>
          <Spin spinning={!this.props.readme}>
            <div
              className="markdown-body"
              style={{ fontSize: '16px', minHeight: '20rem' }}
              dangerouslySetInnerHTML={{ __html: this.props.readme }}
            />
          </Spin>
        </Col>
      </Row>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { readme: state.homeReadMe };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeReadMe: store
      },
      dispatch
    );
  }
)(Home);
