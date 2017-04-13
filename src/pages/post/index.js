/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin, Tag } from 'antd';
import moment from 'moment';

import github from '../../lib/github';

import pkg from '../../../package.json';

import './post.css';

class Post extends Component {
  state = { post: {}, loading: false, number: 0, comments: [] };

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
      this.getComments(pkg.config.owner, pkg.config.repo, number);
    } catch (err) {
      console.error(err);
    }
    this.setState({ post: data, loading: false });
    return data;
  }

  async getComments(owner, repo, number) {
    let comments = [];
    try {
      const {
        data
      } = await github.get(
        `/repos/${owner}/${repo}/issues/${number}/comments`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      console.log(data);
      this.setState({ comments: data });
    } catch (err) {
      console.error(err);
    }
    return comments;
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

        <hr className="hr" />

        <div>
          {this.state.comments.map(comment => {
            return (
              <div key={comment.id}>
                <div className="comment-header">
                  <img
                    style={{ width: '3.2rem', verticalAlign: 'middle' }}
                    src={comment.user.avatar_url}
                    alt=""
                  />
                  <strong style={{ color: '#586069' }}>
                    {comment.user.login}
                  </strong>
                  &nbsp;&nbsp;
                  <span>
                    {' '}
                    {
                      `commented at ${moment(comment.created_at).fromNow()}, updated at ${moment(comment.updated_at).fromNow()}`
                    }
                  </span>
                </div>
                <div className="comment-body">
                  <div
                    className="markdown-body"
                    style={{ fontSize: '1.6rem', padding: '1.5rem' }}
                    dangerouslySetInnerHTML={{ __html: comment.body_html }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Spin>
    );
  }
}

export default Post;
