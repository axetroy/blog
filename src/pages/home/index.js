// @flow
/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Icon, Tooltip, Modal } from 'antd';

import CONFIG from '../../config.json';
import github from '../../lib/github';
import { store } from '../../redux/readme';

import DocumentTitle from '../../component/document-title';
import SourceCode from '../../component/source-code';

class Home extends Component {
  state = {
    source: {},
    visible: false
  };
  componentDidMount() {
    const owner: string = CONFIG.owner;
    const repo: string = CONFIG.repo;
    this.getReadme(owner, repo);
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

  showSourceCode() {
    this.setState({
      visible: true
    });
  }

  hideSourceCode() {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <DocumentTitle title="Home">
        <Spin spinning={!this.props.READ_ME}>
          <div className="edit-this-page-container">
            <Modal
              width={'80%'}
              visible={this.state.visible}
              footer={null}
              onCancel={this.hideSourceCode.bind(this)}
              onOk={this.hideSourceCode.bind(this)}
              maskClosable={true}
              closable={true}
            >
              <SourceCode file={'pages/home/index.js'} />
            </Modal>
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
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <a
                  href="javascript: void 0"
                  target="_blank"
                  onClick={this.showSourceCode.bind(this)}
                >
                  <Icon
                    type="code"
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
