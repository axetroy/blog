/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Pagination, Row, Col, Card, Tag, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { format } from "date-fns";
import queryString from "query-string";

import DocumentTitle from "../../component/document-title";
import github from "../../lib/github";
import actions from "../../redux/actions";
import CONFIG from "../../config.json";

import "./index.css";

class Stackoverflow extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 100,
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
    let posts = this.props.STACKOVERFLOWS || [];
    try {
      const { data, headers } = await github.issues.listForRepo({
        owner: CONFIG.owner,
        repo: "stackoverflow",
        creator: CONFIG.owner,
        state: "all",
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

    this.props.updateStackoverflows(posts);

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
      <DocumentTitle title={["踩过的坑"]}>
        <div style={{ backgroundColor: "#eaebec" }}>
          <Row gutter={24} className="stackoverflow-list">
            {this.props.STACKOVERFLOWS.map((post, i) => {
              return (
                <Col
                  key={post.number + "/" + i}
                  xs={{ span: 22, offset: 1 }}
                  sm={{ span: 12, offset: 0 }}
                  md={{ span: 8, offset: 0 }}
                  lg={{ span: 8, offset: 0 }}
                  xl={{ span: 8, offset: 0 }}
                  xxl={{ span: 6, offset: 0 }}
                >
                  <Card
                    style={{
                      marginBottom: "2rem",
                      minHeight: "200px",
                      height: "300px",
                      overflow: "hidden"
                    }}
                    className="post-list"
                    onClick={() => {
                      this.props.history.push({
                        pathname: `/stackoverflow/${post.number}`
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
                        title={post.title}
                      >
                        {post.title}
                      </h3>
                    </div>
                    <div>
                      <span>
                        <Icon type="clock-circle-o" />{" "}
                        {format(post.created_at, "YYYY-MM-DD")}&nbsp;
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
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        clear: "both",
                        height: "150px"
                      }}
                    >
                      {post.body.slice(0, 150)}...
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {this.state.meta.total > 0 ? (
            <Row className="text-center" style={{ marginBottom: "2rem" }}>
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
    STACKOVERFLOWS: state.STACKOVERFLOWS
  }),
  actions
)(withRouter(Stackoverflow));
