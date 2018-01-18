/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Menu, Spin, Tag, Tooltip, Icon, Popover, Dropdown } from "antd";
import moment from "moment";

import DocumentTitle from "../../component/document-title";
import github from "../../lib/github";
import { firstUpperCase } from "../../lib/utils";
import * as postAction from "../../redux/post";
import CONFIG from "../../config.json";
import Comments from "../../component/comments";
import ViewSourceCode from "../../component/view-source-code";

import "./post.css";

class Post extends Component {
  state = {
    banners: [
      "https://user-images.githubusercontent.com/9758711/35051293-df358be0-fbdf-11e7-9d74-80e8ad97d713.png",
      "https://user-images.githubusercontent.com/9758711/35051427-28b5ed6e-fbe0-11e7-90b5-a5c3f0c9cba2.png",
      "https://user-images.githubusercontent.com/9758711/35051446-3424927c-fbe0-11e7-9e41-5c3725781867.png",
      "https://user-images.githubusercontent.com/9758711/35051488-4c3c2de8-fbe0-11e7-9c5c-0d35a171a15b.png",
      "https://user-images.githubusercontent.com/9758711/35051508-5b01e00c-fbe0-11e7-85e6-ca93570ee11f.png",
      "https://user-images.githubusercontent.com/9758711/35051527-66aaa218-fbe0-11e7-9821-9390595c4ae6.png",
      "https://user-images.githubusercontent.com/9758711/35051549-73e310a0-fbe0-11e7-87ed-3b023cab3019.png",
      "https://user-images.githubusercontent.com/9758711/35051561-7e618ae8-fbe0-11e7-9355-a7285cb4821f.png",
      "https://user-images.githubusercontent.com/9758711/35051580-8a893db6-fbe0-11e7-93ff-5bd11e96630e.png",
      "https://user-images.githubusercontent.com/9758711/35051598-95948738-fbe0-11e7-96c3-dbd6f7c93f71.png",
      "https://user-images.githubusercontent.com/9758711/35051610-9f056a9e-fbe0-11e7-92d4-502b449a4c51.png",
      "https://user-images.githubusercontent.com/9758711/35051630-a956162e-fbe0-11e7-86a0-fd4c4dea6e75.png",
      "https://user-images.githubusercontent.com/9758711/35051654-b3af78fe-fbe0-11e7-9a61-d8a89a4ddf66.png",
      "https://user-images.githubusercontent.com/9758711/35051683-c78c5360-fbe0-11e7-831c-60b5e25188fb.png",
      "https://user-images.githubusercontent.com/9758711/35051708-d447aeb0-fbe0-11e7-8e62-a1042f373488.png",
      "https://user-images.githubusercontent.com/9758711/35051727-dee8460e-fbe0-11e7-8b35-7c4bf8f6d8a9.png",
      "https://user-images.githubusercontent.com/9758711/35051749-e8af347c-fbe0-11e7-951b-2d9e03ee443a.png",
      "https://user-images.githubusercontent.com/9758711/35051761-f24f0c0a-fbe0-11e7-893f-6bfcbb036c3e.png",
      "https://user-images.githubusercontent.com/9758711/35051785-fd3a9fc6-fbe0-11e7-8faf-a97facebe5ce.png"
    ]
  };

  async componentWillMount() {
    let { number } = this.props.match.params;
    const i = Math.floor(Math.random() * this.state.banners.length);
    this.setState({
      banner: this.state.banners[i]
    });

    import("qrcode.react").then(module => {
      this.setState({ QRCode: module });
    });
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
      const { data } = await github.get(
        `/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${number}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.html"
          },
          responseType: "text"
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
    let $div = document.createElement("div");
    $div.innerHTML = html;
    let $banner = $div.querySelector("img[alt=banner]");

    // 如果存在banner，则删除该行的ｐ标签
    if ($banner) {
      if ($banner.src) {
        this.setState({ banner: $banner.src });
      }
      const $parent = $banner.parentElement;
      if ($parent && $parent.tagName === "A") {
        if ($parent.parentNode && $parent.parentElement.tagName === "P") {
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
        title: "分享到新浪微博",
        url: `http://service.weibo.com/share/share.php?appkey=&title=${"分享: " +
          post.title}&url=${
          window.location.href
        }&pic=&searchPic=false&style=simple`
      },
      {
        title: "分享到 Twitter",
        url: `https://twitter.com/intent/tweet?text=${"分享: " +
          post.title}&url=${window.location.href}&via=Axetroy`
      },
      {
        title: "分享到 Telegram",
        url: `https://telegram.me/share/url?url=${
          window.location.href
        }&text=${"分享: " + post.title}`
      },
      {
        title: "分享到 QQ",
        url: `http://connect.qq.com/widget/shareqq/index.html?site=Axetroy's NeverLand&title=${"分享: " +
          post.title}&summary=欢迎来到 Axetroy's NeverLand。&pics=&url=${
          window.location.href
        }`
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
    const { QRCode } = this.state;
    const { number } = this.props.match.params;
    const post = this.props.POST[number] || {};
    return (
      <DocumentTitle title={[post.title, "博客文章"]}>
        <Spin spinning={!Object.keys(post).length}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "24rem",
              backgroundImage: `url(${this.state.banner})`,
              backgroundOrigin: "border-box",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPositionY: "25%"
            }}
          >
            <h2
              style={{
                textAlign: "center",
                position: "absolute",
                width: "100%",
                color: "#fff",
                top: "20%"
              }}
            >
              {post.title}{" "}
              <span
                style={{
                  verticalAlign: "top"
                }}
              >
                {(post.labels || []).map(label => {
                  return (
                    <Tag key={label.id} color={"#" + label.color}>
                      {label.name}
                    </Tag>
                  );
                })}
              </span>
            </h2>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "2rem",
                backgroundColor: "rgba(245, 245, 245, 0.23)"
              }}
            >
              {post.user && post.user.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt=""
                  style={{
                    width: "4.4rem",
                    height: "100%",
                    borderRadius: "50%",
                    verticalAlign: "middle"
                  }}
                />
              ) : (
                ""
              )}
              <div
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  margin: "0 1rem"
                }}
              >
                <strong>
                  <Icon
                    type="user"
                    style={{
                      marginRight: "0.5rem"
                    }}
                  />
                  {firstUpperCase(post && post.user ? post.user.login : "")}
                </strong>
                <br />
                <span>
                  <Icon type="calendar" style={{ marginRight: "0.5rem" }} />
                  {moment(new Date(post.created_at)).fromNow()}
                </span>
                <br />
                <span>
                  <Icon
                    type="message"
                    style={{
                      marginRight: "0.5rem"
                    }}
                  />
                  {post.comments}
                </span>
              </div>
              <div
                style={{
                  textAlign: "right",
                  float: "right",
                  fontSize: "2.4rem"
                }}
              >
                <span style={{ margin: "0.5rem" }}>
                  <Tooltip title="编辑文章" placement="topRight">
                    <a
                      target="blank"
                      href={`https://github.com/${CONFIG.owner}/${
                        CONFIG.repo
                      }/issues/${post.number}`}
                      style={{
                        color: "inherit"
                      }}
                    >
                      <Icon type="edit" />
                    </a>
                  </Tooltip>
                </span>
                <span style={{ margin: "0.5rem" }}>
                  <Tooltip placement="topLeft" title="查看源码">
                    <ViewSourceCode file="pages/post/index.js">
                      <a
                        href="javascript: void 0"
                        target="_blank"
                        style={{ color: "inherit" }}
                      >
                        <Icon type="code" />
                      </a>
                    </ViewSourceCode>
                  </Tooltip>
                </span>
                <span
                  style={{
                    cursor: "pointer",
                    margin: "0.5rem"
                  }}
                >
                  <Popover
                    placement="topLeft"
                    title={"在其他设备中扫描二维码"}
                    trigger="click"
                    content={
                      <div className="text-center">
                        {QRCode ? (
                          <QRCode value={window.location.href} />
                        ) : (
                          "Loading..."
                        )}
                      </div>
                    }
                  >
                    <Icon type="qrcode" />
                  </Popover>
                </span>
                <span
                  style={{
                    cursor: "pointer",
                    margin: "0.5rem"
                  }}
                >
                  <Dropdown
                    overlay={this.getShareMenu(post)}
                    trigger={["click"]}
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
              margin: "2rem 0",
              borderBottom: "1px solid #e6e6e6",
              paddingBottom: "2rem"
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
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid #e6e6e6"
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
