/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Spin, Pagination, Row, Col, Card, Tag, Icon, Tooltip } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import LazyLoad from "react-lazyload";

import DocumentTitle from "../../component/document-title";
import ViewSourceCode from "../../component/view-source-code";
import github from "../../lib/github";
import { firstUpperCase } from "../../lib/utils";

import actions from "../../redux/actions";

import CONFIG from "../../config.json";

import "./index.css";

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
      total: 0
    }
  };

  async componentWillMount() {
    const query = queryString.parse(this.props.location.search);
    let { page, per_page } = query;
    page = +page || this.state.meta.page;
    per_page = +per_page || this.state.meta.per_page;
    this.setState({
      meta: {
        ...this.state.meta,
        ...{ page: +page, per_page: +per_page }
      }
    });
    await this.getPosts(page, per_page);
  }

  async getPosts(page, per_page) {
    let posts = this.props.POSTS || [];
    try {
      const res = await github.get(
        `/repos/${CONFIG.owner}/${CONFIG.repo}/issues`,
        {
          params: { creator: CONFIG.owner, page, per_page, state: "open" }
        }
      );

      const link = res.headers.link;

      /**
       * Pagination
       * # see detail https://developer.github.com/guides/traversing-with-pagination/
       */
      if (link) {
        const last = link.match(/<([^>]+)>(?=\;\s+rel="last")/);
        const lastPage = last ? last[1].match(/page=(\d+)/)[1] : page;
        this.setState({
          meta: {
            ...this.state.meta,
            ...{ page, per_page, total: lastPage * per_page }
          }
        });
      }

      posts = res.data;
    } catch (err) {
      console.error(err);
    }

    posts.forEach(post => {
      // 获取第一张图片作为缩略图
      let match = /!\[[^\]]+\]\(([^\)]+)\)/im.exec(post.body);
      if (match && match[1]) {
        post.thumbnails = match[1];
      }
    });

    this.props.updateArticles(posts);

    return posts;
  }

  changePage(page, per_page) {
    const oldQuery = queryString.parse(this.props.location.search);
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page, per_page }))
    });
    this.getPosts(page, per_page);
  }

  render() {
    return (
      <DocumentTitle title={["博客文章"]}>
        <Spin spinning={false}>
          <div className={"toolbar-container"}>
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/posts/index.js">
                  <a href="javascript: void 0" target="_blank">
                    <Icon
                      type="code"
                      style={{
                        fontSize: "3rem"
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <Row gutter={24}>
              {this.props.POSTS.map((post, i) => {
                return (
                  <Col xs={24} sm={12} md={12} xxl={8}>
                    <Card
                      style={{
                        margin: "2rem 0",
                        height: "300px",
                        overflow: "hidden"
                      }}
                      className="post-list"
                      key={post.number + "/" + i}
                      onClick={() => {
                        this.props.history.push({
                          ...this.props.location,
                          pathname: `/post/${post.number}`
                        });
                      }}
                    >
                      <div>
                        <h3
                          className="post-title"
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden"
                          }}
                        >
                          {post.title}
                        </h3>
                      </div>
                      <div>
                        <span>
                          <Icon type="clock-circle-o" />{" "}
                          {moment(post.created_at).format("YYYY-MM-DD")}{" "}
                        </span>
                        <span>
                          <Icon type="message" /> {post.comments}{" "}
                        </span>

                        <span className="label-list">
                          {(post.labels || []).map(label => {
                            return (
                              <Tag key={label.id} color={"#" + label.color}>
                                {label.name}
                              </Tag>
                            );
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#9E9E9E",
                          wordBreak: "break-word",
                          // whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          clear: "both"
                        }}
                      >
                        {post.body.slice(0, 350)}...
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {this.state.meta.total > 0 ? (
              <Row className="text-center">
                <Col span={24} style={{ transition: "all 1s" }}>
                  <Pagination
                    onChange={page =>
                      this.changePage(page, this.state.meta.per_page)
                    }
                    defaultCurrent={this.state.meta.page}
                    defaultPageSize={this.state.meta.per_page}
                    total={this.state.meta.total}
                  />
                </Col>
              </Row>
            ) : (
              ""
            )}
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  state => ({
    POSTS: state.POSTS
  }),
  actions
)(withRouter(Posts));
