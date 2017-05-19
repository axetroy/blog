// @flow
/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Icon, Tooltip } from 'antd';

import CONFIG from '../../config.json';
import github from '../../lib/github';
import { store } from '../../redux/readme';

import DocumentTitle from '../../component/document-title';

class Home extends Component {
  componentDidMount() {
    const owner: string = CONFIG.owner;
    const repo: string = CONFIG.repo;
    this.getReadme(owner, repo);
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

  async getReadme(owner: string, repo: string) {
    let html: string = '';
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
      <DocumentTitle title="Home">
        <Spin spinning={!this.props.READ_ME}>
          <div className="edit-this-page-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
                <a
                  href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}/edit/master/README.md`}
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
                __html: this.props.READ_ME
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
      READ_ME: state.READ_ME
    };
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
