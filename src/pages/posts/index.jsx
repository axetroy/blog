import { Card, Col, Icon, Pagination, Row, Tag } from "antd";
import { format } from "date-fns";
import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { connect } from "redux-zero/react";
import DocumentTitle from "../../component/document-title";
import CONFIG from "../../config.json";
import github from "../../lib/github";
import actions from "../../redux/actions";
import "./index.css";

function Posts(props) {
  const { POSTS, updateArticles } = props;
  const history = useHistory();
  const location = useLocation();
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0 });

  const query = queryString.parse(location.search);
  meta.page = +query.page || meta.page;
  meta.per_page = +query.per_page || meta.per_page;

  const controller = new AbortController();

  function changePage(page, per_page) {
    const oldQuery = queryString.parse(location.search);
    history.push({
      search: queryString.stringify(Object.assign(oldQuery, { page, per_page }))
    });
    getPosts(page, per_page);
  }

  async function getPosts(page, per_page) {
    const { data: posts, headers } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      creator: CONFIG.owner,
      state: "open",
      per_page,
      page,
      request: {
        signal: controller.signal
      }
    });

    const link = headers.link;

    /**
     * Pagination
     * # see detail https://developer.github.com/guides/traversing-with-pagination/
     */
    if (link) {
      const last = link.match(/<([^>]+)>(?=;\s+rel="last")/);
      const lastPage = last ? last[1].match(/\bpage=(\d+)/)[1] : page;
      setMeta({
        ...meta,
        ...{ page, per_page, total: lastPage * per_page }
      });
    }

    posts.forEach(post => {
      // 获取第一张图片作为缩略图
      let match = /!\[[^\]]+\]\(([^)]+)\)/im.exec(post.body);
      if (match && match[1]) {
        post.thumbnails = match[1];
      }
    });

    updateArticles(posts);
  }

  useEffect(() => {
    getPosts(meta.page, meta.per_page).catch(() => {});
    return function() {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DocumentTitle title={["博客文章"]}>
      <div style={{ backgroundColor: "#eaebec" }}>
        <Row gutter={24} className="post-row">
          {POSTS.map((post, i) => {
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
                          display: "inline-block",
                          maxWidth: "100%"
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

        {meta.total > 0 ? (
          <Row className="text-center" style={{ paddingBottom: "2rem" }}>
            <Col span={24} style={{ transition: "all 1s" }}>
              <Pagination
                onChange={page => changePage(page, meta.per_page)}
                defaultCurrent={meta.page}
                defaultPageSize={meta.per_page}
                total={meta.total}
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

export default connect(
  state => ({
    POSTS: state.POSTS
  }),
  actions
)(Posts);
