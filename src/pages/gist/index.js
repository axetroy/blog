/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tooltip, Icon } from 'antd';
import moment from 'moment';

import github from '../../lib/github';
import * as gistAction from '../../redux/gist';

function values(obj) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]]);
    }
  }
  return result;
}

class Gist extends Component {
  state = { comments: [] };

  async componentWillMount() {
    let { id } = this.props.match.params;
    if (id) {
      await [this.getGist(id), this.getComments(id)];
    }
  }

  async componentWillReceiveProps(nextProp) {
    const { id } = nextProp.match.params;
    if (id && id !== this.props.match.params.id) {
      await [this.getGist(id), this.getComments(id)];
    }
  }

  async getGist(id) {
    let gist = {};
    try {
      const { data } = await github.get(`/gists/${id}`, {
        headers: {
          Accept: 'application/vnd.github.v3.html'
        },
        responseType: 'text'
      });
      gist = data;

      for (let filename in gist.files) {
        const file = gist.files[filename];
        const res = await github.post(
          '/markdown',
          {
            text: '```' + file.language + '\n' + file.content + '\n```',
            mode: 'markdown'
          },
          { responseType: 'text' }
        );
        file.html = res.data;
      }
    } catch (err) {
      console.error(err);
    }
    this.props.setGist({ [id]: gist });
    return gist;
  }

  async getComments(id) {
    let comments = [];
    try {
      const { data } = await github.get(`/gists/${id}/comments`, {
        headers: {
          Accept: 'application/vnd.github.v3.html'
        },
        responseType: 'text'
      });
      comments = comments.concat(data || []);
    } catch (err) {
      console.error(err);
    }
    this.setState({ comments });
    return comments;
  }

  render() {
    const { id } = this.props.match.params;
    const gist = (this.props.GIST || {})[id] || {};
    return (
      <Spin spinning={!Object.keys(gist).length}>
        <div className="edit-this-page-container">
          <div className="edit-this-page">
            <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
              <a
                href={`https://gist.github.com/${gist.owner ? gist.owner.login : ''}/${gist.id}/edit`}
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
          {(values(gist.files) || []).map(file => {
            return (
              <div key={file.filename} style={{}}>
                <h3><Icon type="file" />{file.filename}</h3>
                <div
                  className="markdown-body"
                  style={{
                    fontSize: '1.6rem'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: file.html
                  }}
                />
              </div>
            );
          })}

          <hr className="hr" />

          <div>
            <h3>
              大牛们的评论:
              <a
                target="_blank"
                href={gist.html_url}
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
        </div>

      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      GIST: state.GIST
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setGist: gistAction.set
      },
      dispatch
    );
  }
)(Gist);
