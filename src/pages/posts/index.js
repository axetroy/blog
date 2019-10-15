/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Pagination, Row, Col, Card, Tag, Icon } from "antd";
import { withRouter, NavLink } from "react-router-dom";
import { format } from "date-fns";
import queryString from "query-string";

import DocumentTitle from "../../component/document-title";
import github from "../../lib/github";
import actions from "../../redux/actions";
import CONFIG from "../../config.json";

import "./index.css";

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 25,
      total: 0
    }
  };

  async UNSAFE_componentWillMount() {
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
      const { data, headers } = await github.issues.listForRepo({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        creator: CONFIG.owner,
        state: "open",
        per_page,
        page
      });

      const link = headers.link;

      /**
       * Pagination
       * # see detail https://developer.github.com/guides/traversing-with-pagination/
       */
      if (link) {
        const last = link.match(/<([^>]+)>(?=;\s+rel="last")/);
        const lastPage = last ? last[1].match(/\bpage=(\d+)/)[1] : page;
        this.setState({
          meta: {
            ...this.state.meta,
            ...{ page, per_page, total: lastPage * per_page }
          }
        });
      }

      posts = data;
    } catch (err) {
      console.error(err);
    }

    posts.forEach(post => {
      // 获取第一张图片作为缩略图
      let match = /!\[[^\]]+\]\(([^)]+)\)/im.exec(post.body);
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
      search: queryString.stringify(Object.assign(oldQuery, { page, per_page }))
    });
    this.getPosts(page, per_page);
  }

  render() {
    return (
      <DocumentTitle title={["博客文章"]}>
        <div style={{ backgroundColor: "#eaebec" }}>
          <Row gutter={24} className="post-row">
            {this.props.POSTS.map((post, i) => {
              return (
                <Col key={post.number + "/" + i} xs={24}>
                  <Card
                    style={{
                      overflow: "hidden"
                    }}
                    className="post-list"
                  >
                    <div>
                      <NavLink to={`/post/${post.number}`}>
                        <h3
                          className="post-title"
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            display: "inline-block"
                          }}
                        >
                          {post.title}
                        </h3>
                      </NavLink>
                    </div>
                    <div>
                      <span>
                        <Icon type="clock-circle-o" />{" "}
                        {format(new Date(post.created_at), "yyyy-MM-dd")}
                        &nbsp;
                      </span>
                      <span>
                        <Icon type="message" /> {post.comments}{" "}
                      </span>

                      <span className="label-list">
                        {(post.labels || []).map(label => {
                          return (
                            <a
                              key={label.id}
                              href={
                                "https://github.com/axetroy/blog/labels/" +
                                label.name
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Tag color={"#" + label.color}>{label.name}</Tag>
                            </a>
                          );
                        })}
                      </span>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {this.state.meta.total > 0 ? (
            <Row className="text-center" style={{ paddingBottom: "2rem" }}>
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
