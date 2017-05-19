/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Menu, Spin, Tag, Tooltip, Icon, Popover, Dropdown } from 'antd';
import moment from 'moment';

import DocumentTitle from '../../component/document-title';
import github from '../../lib/github';
import { firstUpperCase } from '../../lib/utils';
import * as postAction from '../../redux/post';
import CONFIG from '../../config.json';
import Comments from '../../component/comments';

import './post.css';

let QRCode;

class Post extends Component {
  state = {
    banner: `img/banner/material-${parseInt(Math.random() * 10 + 1)}.png`
  };

  async componentWillMount() {
    let { number } = this.props.match.params;
    require.ensure(
      [],
      require => {
        QRCode = require('qrcode.react');
      },
      'react-qrcode'
    );
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
        `/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${number}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      post = data;
      post.filter_html = this.htmlFilter(data.body_html);
    } catch (err) {
      console.error(err);
    }
    this.props.setPost({ [number]: post });
    return post;
  }

  htmlFilter(html) {
    // 提取第一张图片作为封面
    let $div = document.createElement('div');
    $div.innerHTML = html;
    let $banner = $div.querySelector('img[alt=banner]');

    // 如果存在banner，则删除该行的ｐ标签
    if ($banner) {
      if ($banner.src) {
        this.setState({ banner: $banner.src });
      }
      const $parent = $banner.parentElement;
      if ($parent && $parent.tagName === 'A') {
        if ($parent.parentNode && $parent.parentElement.tagName === 'P') {
          $parent.parentElement.remove();
        } else {
          $parent.remove();
        }
      } else {
        $banner.remove();
      }
    }
    return $div.innerHTML;
  }

  getShareMenu(post) {
    const shareMenu = [
      {
        title: '分享到新浪微博',
        url: `http://service.weibo.com/share/share.php?appkey=&title=${'分享: ' + post.title}&url=${window.location.href}&pic=&searchPic=false&style=simple`
      },
      {
        title: '分享到 Twitter',
        url: `https://twitter.com/intent/tweet?text=${'分享: ' + post.title}&url=${window.location.href}&via=Axetroy`
      },
      {
        title: '分享到 Telegram',
        url: `https://telegram.me/share/url?url=${window.location.href}&text=${'分享: ' + post.title}`
      },
      {
        title: '分享到 QQ',
        url: `http://connect.qq.com/widget/shareqq/index.html?site=Axetroy's NeverLand&title=${'分享: ' + post.title}&summary=欢迎来到 Axetroy's NeverLand。&pics=&url=${window.location.href}`
      }
    ];
    return (
      <Menu>
        {shareMenu.map(menu => {
          return (
            <Menu.Item key={menu.title}>
              <a target="_blank" href={menu.url}>
                {menu.title}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
  render() {
    const { number } = this.props.match.params;
    const post = this.props.POST[number] || {};
    return (
      <DocumentTitle title={post.title} suffix={['博客文章']}>
        <Spin spinning={!Object.keys(post).length}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '24rem',
              backgroundImage: `url(${this.state.banner})`,
              backgroundOrigin: 'border-box',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPositionY: '25%'
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
                color: '#fff',
                top: '20%'
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
            </h2>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '2rem',
                backgroundColor: 'rgba(245, 245, 245, 0.23)'
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
                <strong>
                  <Icon
                    type="user"
                    style={{
                      marginRight: '0.5rem'
                    }}
                  />{firstUpperCase(post && post.user ? post.user.login : '')}
                </strong>
                <p>
                  <Icon type="calendar" style={{ marginRight: '0.5rem' }} />
                  {moment(new Date(post.created_at)).fromNow()}
                </p>
                <p>
                  <Icon
                    type="message"
                    style={{
                      marginRight: '0.5rem'
                    }}
                  />
                  {post.comments}
                </p>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  float: 'right',
                  fontSize: '2.4rem'
                }}
              >
                <span style={{ margin: '0.5rem' }}>
                  <Tooltip title="编辑文章" placement="topRight">
                    <a
                      target="blank"
                      href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}/issues/${post.number}`}
                      style={{
                        color: 'inherit'
                      }}
                    >
                      <Icon type="edit" />
                    </a>
                  </Tooltip>
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    margin: '0.5rem'
                  }}
                >
                  <Popover
                    placement="topLeft"
                    title={'在其他设备中扫描二维码'}
                    trigger="click"
                    content={
                      <div className="text-center">
                        {QRCode
                          ? <QRCode value={window.location.href} />
                          : 'Loading...'}
                      </div>
                    }
                  >
                    <Icon type="qrcode" />
                  </Popover>
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    margin: '0.5rem'
                  }}
                >
                  <Dropdown
                    overlay={this.getShareMenu(post)}
                    trigger={['click']}
                  >
                    <Icon type="share-alt" />
                  </Dropdown>
                </span>
              </div>
            </div>
          </div>

          <div
            className="markdown-body post-content"
            style={{
              margin: '2rem 0',
              borderBottom: '1px solid #e6e6e6',
              paddingBottom: '2rem'
            }}
            dangerouslySetInnerHTML={{
              __html: post.filter_html
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
            <Comments
              type="issues"
              owner={CONFIG.owner}
              repo={CONFIG.repo}
              number={post.number}
            />
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { POST: state.POST };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPost: postAction.set }, dispatch);
  }
)(withRouter(Post));
