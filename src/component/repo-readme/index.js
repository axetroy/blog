/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin } from 'antd';

import github from '../../lib/github';

class RepoReadme extends Component {
  state = { readmeLoading: true };

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async componentWillMount() {
    await this.getReadme(this.props.owner, this.props.repo);
  }

  async getReadme(owner, repo) {
    let html = '';
    try {
      await this.setStateAsync({ readmeLoading: true });
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
    this.setState({ readme: html, readmeLoading: false });
    return html;
  }

  render() {
    return (
      <Spin spinning={this.state.readmeLoading}>
        <div
          className="markdown-body"
          style={{ fontSize: '16px', minHeight: '20rem' }}
          dangerouslySetInnerHTML={{ __html: this.state.readme }}
        />
      </Spin>
    );
  }
}

export default RepoReadme;
