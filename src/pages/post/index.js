/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Row, Col, Tag, Tooltip, Icon, Popover } from 'antd';
import moment from 'moment';
import QRCode from 'qrcode.react';

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
        <Row>
          <Col
            style={{
              marginBottom: '2rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid #e6e6e6'
            }}
          >
            {post.user && post.user.avatar_url
              ? <img
                  src={post.user.avatar_url}
                  alt=""
                  style={{
                    width: '4.4rem',
                    height: '100%',
                    borderRadius: '50%',
                    verticalAlign: 'middle'
                  }}
                />
              : ''}
            <div
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                margin: '0 1rem'
              }}
            >
              <strong>{post.user.login}</strong>
              <p>{moment(new Date(post.created_at)).fromNow()}</p>
            </div>
            <div
              style={{ textAlign: 'right', float: 'right', fontSize: '2.4rem' }}
            >
              <Popover
                placement="topLeft"
                title={'在其他设备中扫描二维码'}
                trigger="click"
                content={
                  <div className="text-center">
                    <QRCode value={location.href} />
                  </div>
                }
              >
                <Icon type="qrcode" />
              </Popover>
              <span>
                <Tooltip title="编辑文章">
                  <a
                    target="blank"
                    href={`https://github.com/${pkg.config.owner}/${pkg.config.repo}/issues/${post.number}`}
                    style={{
                      color: 'inherit'
                    }}
                  >
                    <Icon type="edit" />
                  </a>
                </Tooltip>
              </span>
            </div>
          </Col>

          <h3
            style={{
              textAlign: 'center'
            }}
          >
            {post.title} <span
              style={{
                verticalAlign: 'top'
              }}
            >
              {(post.labels || []).map(label => {
                return (
                  <Tag key={label.id} color={'#' + label.color}>
                    {label.name}
                  </Tag>
                );
              })}
            </span>
          </h3>

          <div
            className="markdown-body"
            style={{
              margin: '2rem 0',
              borderBottom: '1px solid #e6e6e6',
              paddingBottom: '2rem'
            }}
            dangerouslySetInnerHTML={{
              __html: post.body_html
            }}
          />

          <blockquote>
            <p>注意：</p>
            <p>1. 若非声明文章为转载, 则为原创文章.</p>
            <p>2. 欢迎转载, 但需要注明出处.</p>
            <p>3. 如果本文对您造成侵权，请在文章评论中声明.</p>
          </blockquote>

          <div
            style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e6e6e6'
            }}
          >
            <h3>
              大牛们的评论:
              <a
                target="_blank"
                href={`https://github.com/${pkg.config.owner}/${pkg.config.repo}/issues/${post.number}`}
                style={{
                  float: 'right'
                }}
              >
                朕有话说
              </a>
            </h3>

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
                      <div
                        className="comment-header"
                        style={{
                          overflow: 'hidden'
                        }}
                      >
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
                          {`commented at ${moment(comment.created_at).fromNow()}`}
                          &nbsp;&nbsp;
                          {`updated at ${moment(comment.updated_at).fromNow()}`}
                        </span>
                      </div>
                      <div
                        className="comment-body"
                        style={{
                          padding: '1.2rem'
                        }}
                      >
                        <div
                          className="markdown-body"
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
        </Row>

      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      POST: state.POST
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPost: postAction.set }, dispatch);
  }
)(Post);
