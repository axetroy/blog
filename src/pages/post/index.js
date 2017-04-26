/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tag, Tooltip, Icon, Input, Tabs, Button, Modal } from 'antd';
import moment from 'moment';

const TabPane = Tabs.TabPane;
import github from '../../lib/github';
import * as postAction from '../../redux/post';
import * as markdownPreviewAction from '../../redux/tool-md-preview';
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

  async onTabChange(tab) {
    let html = '';
    if (tab === 'preview') {
      const { data } = await github.post(
        '/markdown',
        {
          text: this.props.TOOL_MD_PREVIEW.markdown,
          mode: 'markdown'
        },
        {
          responseType: 'text'
        }
      );
      this.props.storeHTML(data);
    }
    return html;
  }

  async submit(number) {
    const { owner, repo } = pkg.config;
    try {
      await github.post(
        `/repos/${owner}/${repo}/issues/${number}/comments`,
        {
          body: this.props.TOOL_MD_PREVIEW.markdown
        },
        {
          params: {
            access_token: this.props.OAUTH.access_token
          }
        }
      );
      await this.getComments(owner, repo, number);
      this.props.storeMd('');
      this.props.storeHTML('');
    } catch (err) {
      console.error(err);
      Modal.error({
        title: '发生错误',
        content: err + ''
      });
    }
  }
  render() {
    const { number } = this.props.match.params;
    const post = this.props.POST[number] || {};
    return (
      <Spin spinning={!Object.keys(post).length}>
        <div
          className="edit-this-page-container"
          style={{
            padding: '2.4rem'
          }}
        >
          <h2>{post.title}</h2>
          <div>
            {post.user
              ? <p>
                  Created by
                  {' '}
                  {post.user && post.user.login}
                  {' '}
                  at
                  {' '}
                  {post.created_at && moment(post.created_at).fromNow()}
                </p>
              : ''}

          </div>
          <div
            style={{
              margin: '1rem 0'
            }}
          >
            {post.labels &&
              post.labels.map((v, i) => {
                return (
                  <Tag color={'#' + v.color} key={i}>
                    {v.name}
                  </Tag>
                );
              })}
          </div>
          <div className="edit-this-page">
            <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
              <a
                href={`https://github.com/${pkg.config.owner}/${pkg.config.repo}/issues/${post.number}`}
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
            style={{
              fontSize: '1.6rem',
              minHeight: '20rem'
            }}
            dangerouslySetInnerHTML={{
              __html: post.body_html
            }}
          />
          <hr className="hr" />
          <div>
            <h3>留言: </h3>

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
                          minHeight: '10rem'
                        }}
                      >
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

            <h3>
              <a
                target="_blank"
                href={`https://github.com/${pkg.config.owner}/${pkg.config.repo}/issues/${post.number}`}
              >
                我要发表看法
              </a>
            </h3>

            {this.props.USER && this.props.USER.name
              ? <div>
                  <Tabs
                    defaultActiveKey="source"
                    onChange={tab => this.onTabChange(tab)}
                    animated={false}
                  >
                    <TabPane tab="Markdown" key="source">
                      <Input
                        defaultValue={this.props.TOOL_MD_PREVIEW.markdown}
                        style={{
                          fontSize: '1.6rem'
                        }}
                        type="textarea"
                        placeholder="以Markdown格式书写"
                        autosize={{
                          minRows: 10,
                          maxRows: 20
                        }}
                        onChange={event =>
                          this.props.storeMd(event.target.value)}
                      />
                    </TabPane>
                    <TabPane tab="Preview" key="preview">
                      <div
                        className="markdown-body"
                        style={{
                          fontSize: '1.6rem',
                          minHeight: '20rem'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: this.props.TOOL_MD_PREVIEW.html + ''
                        }}
                      />
                    </TabPane>
                  </Tabs>

                  <div
                    style={{
                      margin: '2rem 0'
                    }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => this.submit(post.number)}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              : ''}

          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      POST: state.POST,
      TOOL_MD_PREVIEW: state.TOOL_MD_PREVIEW,
      OAUTH: state.OAUTH,
      USER: state.USER
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setPost: postAction.set,
        storeHTML: markdownPreviewAction.setHTML,
        storeMd: markdownPreviewAction.setMarkdown
      },
      dispatch
    );
  }
)(Post);
