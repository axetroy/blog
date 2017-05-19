/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Spin, Tooltip, Icon } from 'antd';
import CONFIG from '../../config.json';
import github from '../../lib/github';

import * as aboutAction from '../../redux/about';

import DocumentTitle from '../../component/document-title';

class About extends Component {
  componentDidMount() {
    const { owner, repo } = CONFIG;
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
      <DocumentTitle title="关于我">
        <Spin spinning={!this.props.ABOUT_ME}>
          <div className="edit-this-page-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
                <a
                  href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}/edit/master/ABOUTME.md`}
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
              dangerouslySetInnerHTML={{
                __html: this.props.ABOUT_ME
              }}
            />
          </div>
        </Spin>
      </DocumentTitle>
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
)(withRouter(About));
