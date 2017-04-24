/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Row, Col, Tooltip, Icon } from 'antd';
import pkg from '../../../package.json';
import github from '../../lib/github';

import * as aboutAction from '../../redux/about';

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
      <Row style={{ padding: '2.4rem' }}>
        <Col
          xl={{ span: 14 }}
          lg={{ span: 18 }}
          md={{ span: 20 }}
          sm={{ span: 22 }}
          xs={{ span: 24 }}
        >
          <Spin spinning={!this.props.ABOUT_ME}>
            <div className="edit-this-page-container">
              <div className="edit-this-page">
                <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
                  <a
                    href={`https://github.com/${pkg.config.owner}/${pkg.config.repo}/edit/master/ABOUTME.md`}
                    target="_blank"
                  >
                    <Icon
                      type="edit"
                      style={{
                        fontSize: '3rem'
                      }}
                    />
                  </a>
                </Tooltip>
              </div>
              <div
                className="markdown-body"
                style={{
                  fontSize: '1.6rem',
                  minHeight: '20rem'
                }}
                dangerouslySetInnerHTML={{
                  __html: this.props.ABOUT_ME
                }}
              />
            </div>
          </Spin>
        </Col>
      </Row>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      ABOUT_ME: state.ABOUT_ME
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeAboutMe: aboutAction.store
      },
      dispatch
    );
  }
)(About);
