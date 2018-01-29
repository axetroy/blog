// @flow
/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin, Icon, Tooltip } from 'antd';
import { connect } from 'redux-zero/react';

import CONFIG from '../../config.json';
import github from '../../lib/github';

import actions from '../../redux/actions';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';

class Home extends Component {
  state = {
    source: {},
    visible: false,
  };
  componentDidMount() {
    const owner: string = CONFIG.owner;
    const repo: string = CONFIG.repo;
    this.getReadme(owner, repo);
  }

  async getReadme(owner: string, repo: string) {
    let html: string = '';
    try {
      const response = await github.get(`/repos/${owner}/${repo}/readme`, {
        headers: {
          Accept: 'application/vnd.github.v3.html',
        },
        responseType: 'text',
      });
      html = response.data;
    } catch (err) {
      console.error(err);
    }
    this.props.setReadMe(html);
    return html;
  }

  render() {
    return (
      <DocumentTitle title={['Home']}>
        <Spin spinning={!this.props.README}>
          <div className="toolbar-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
                <a
                  href={`https://github.com/${CONFIG.owner}/${
                    CONFIG.repo
                  }/edit/master/README.md`}
                  target="_blank"
                >
                  <Icon
                    type="edit"
                    style={{
                      fontSize: '3rem',
                    }}
                  />
                </a>
              </Tooltip>

              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/home/index.js">
                  <a href="javascript: void 0" target="_blank">
                    <Icon
                      type="code"
                      style={{
                        fontSize: '3rem',
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: this.props.README,
              }}
            />
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  state => ({
    README: state.README,
  }),
  actions
)(Home);
