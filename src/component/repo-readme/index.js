/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin } from 'antd';

import github from '../../lib/github';

class RepoReadme extends Component {
  state = { readme: null };
  async componentWillMount() {
    await this.getReadme(this.props.owner, this.props.repo);
  }

  async componentWillReceiveProps(nextProp) {
    const { repo } = nextProp;
    if (repo && this.props.repo !== repo) {
      await this.getReadme(nextProp.owner, nextProp.repo);
    }
  }

  async getReadme(owner, repo) {
    let html = '';
    try {
      const { data } = await github.get(`/repos/${owner}/${repo}/readme`, {
        headers: {
          Accept: 'application/vnd.github.v3.html',
        },
        responseType: 'text',
      });
      html = data;
    } catch (err) {
      console.error(err);
    }
    this.setState({ readme: html });
    return html;
  }

  render() {
    return (
      <Spin spinning={false}>
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
