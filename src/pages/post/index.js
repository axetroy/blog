/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tag } from 'antd';
import moment from 'moment';

import github from '../../lib/github';
import * as postAction from '../../redux/post';
import pkg from '../../../package.json';

import './post.css';

class Post extends Component {
  state = { comments: [] };

  async componentWillMount() {
    let { number } = this.props.match.params;
    if (number) {
      await this.getPost(number);
    }
  }

  async componentWillReceiveProps(nextProp) {
    const { number } = nextProp.match.params;
    if (number && number !== this.props.match.params.number) {
      await this.getPost(nextProp.match.params.number);
    }
  }

  async getPost(number) {
    let post = {};
    try {
      const {
        data
      } = await github.get(
        `/repos/${pkg.config.owner}/${pkg.config.repo}/issues/${number}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      post = data;
      this.getComments(pkg.config.owner, pkg.config.repo, number);
    } catch (err) {
      console.error(err);
    }
    this.props.setPost({ [number]: post });
    return post;
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
      this.setState({ comments: data });
    } catch (err) {
      console.error(err);
    }
    return comments;
  }

  render() {
    const { number } = this.props.match.params;
    const post = this.props.POST[number] || {};
    return (
      <Spin spinning={!Object.keys(post).length}>

        <h2>{post.title}</h2>
        <div>
          <p>
            Created by
            {' '}
            {post.user && post.user.login}
            {' '}
            at
            {' '}
            {post.created_at && moment(post.created_at).fromNow()}
          </p>
        </div>
        <div style={{ margin: '1rem 0' }}>
          {post.labels &&
            post.labels.map((v, i) => {
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
          dangerouslySetInnerHTML={{
            __html: post.body_html
          }}
        />

        <hr className="hr" />

        <div>
          <h3>大牛们的评论: </h3>

          <p style={{ fontSize: '1.5rem' }}>
            <a
              target="_blank"
              href={
                `https://github.com/${pkg.config.owner}/${pkg.config.repo}/issues/${post.number}`
              }
            >
              朕有话说
            </a>
          </p>

          {this.state.comments.length
            ? this.state.comments.map(comment => {
                return (
                  <div
                    key={comment.id}
                    style={{
                      border: '0.1rem solid #e2e2e2',
                      borderRadius: '0.5rem',
                      margin: '1rem 0'
                    }}
                  >
                    <div className="comment-header">
                      <img
                        style={{
                          width: '3.2rem',
                          verticalAlign: 'middle',
                          borderRadius: '50%'
                        }}
                        src={comment.user.avatar_url}
                        alt=""
                      />
                      &nbsp;&nbsp;
                      <strong
                        style={{
                          color: '#586069'
                        }}
                      >
                        <a
                          target="_blank"
                          href={`https://github.com/${comment.user.login}`}
                        >
                          {comment.user.login}
                        </a>
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
                        style={{
                          fontSize: '1.6rem',
                          padding: '1.5rem'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: comment.body_html
                        }}
                      />
                    </div>
                  </div>
                );
              })
            : <div>
                <p>还没有人评论哦，赶紧抢沙发!</p>
              </div>}

        </div>
      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { POST: state.POST };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setPost: postAction.set
      },
      dispatch
    );
  }
)(Post);
