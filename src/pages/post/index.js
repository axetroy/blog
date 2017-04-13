/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin, Tag } from 'antd';
import moment from 'moment';

import github from '../../lib/github';

import pkg from '../../../package.json';

class Post extends Component {
  state = { post: {}, loading: false, number: 0 };

  async componentWillMount() {
    let { number } = this.props.match.params;
    if (number) {
      await this.getPost(number);
    }
  }

  async componentWillReceiveProps(nextProp) {
    const { number } = nextProp.match.params;
    if (number && number !== this.state.number) {
      await this.getPost(nextProp.match.params.number);
    }
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async getPost(number) {
    let data = {};
    try {
      await this.setStateAsync({ loading: true, number });
      const res = await github.get(
        `/repos/${pkg.config.owner}/${pkg.config.repo}/issues/${number}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    this.setState({ post: data, loading: false });
    return data;
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
        <h2>{this.state.post.title}</h2>
        <div>
          <p>
            Created by
            {' '}
            {this.state.post.user && this.state.post.user.login}
            {' '}
            at
            {' '}
            {this.state.post.created_at &&
              moment(this.state.post.created_at).fromNow()}
          </p>
        </div>
        <div style={{ margin: '1rem 0' }}>
          {this.state.post.labels &&
            this.state.post.labels.map((v, i) => {
              return (
                <Tag color={'#' + v.color} key={i}>
                  {v.name}
                </Tag>
              );
            })}
        </div>
        <div
          className="markdown-body"
          style={{ fontSize: '1.6rem', minHeight: '20rem' }}
          dangerouslySetInnerHTML={{ __html: this.state.post.body_html }}
        />
      </Spin>
    );
  }
}

export default Post;
