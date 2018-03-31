/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Row, Col, Spin, Tag } from "antd";
import moment from "moment";
import { lazyload } from "react-lazyload";

import graphql from "../../lib/graphql";
import actions from "../../redux/actions";

const styles = {
  infoBlock: {
    width: "80%",
    margin: "1rem auto",
    textAlign: "center",
    color: "#fff",
    padding: "2rem"
  },
  strong: { fontSize: "2em" }
};

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class GithubUserInfo extends Component {
  async componentWillMount() {
    try {
      const response = await graphql(
        `
          query {
            viewer {
              name
              login
              bio
              avatarUrl
              url
              createdAt
              isHireable
              followers(first: 100) {
                totalCount
              }
              following(first: 100) {
                totalCount
              }
              repositories(privacy: PUBLIC) {
                totalCount
                totalDiskUsage
              }
            }
          }
        `
      )();
      this.props.updateOwner(response.data.data.viewer);
    } catch (err) {
      console.error(err);
    }
  }

  changePage(page, per_page) {
    this.getFollowings(page, per_page);
  }

  render() {
    const owner = this.props.OWNER || {};
    return (
      <Spin spinning={!owner}>
        <Row>
          <Col span={4}>
            <a href={owner.url} target="_blank">
              <img
                alt={owner.avatarUrl}
                style={{
                  width: "70%",
                  height: "auto",
                  borderRadius: "50%",
                  verticalAlign: "middle"
                }}
                src={owner.avatarUrl}
              />
            </a>
          </Col>
          <Col span={20}>
            <p>{owner.name}</p>
            <p>
              加入时间：
              {owner.createdAt && moment(owner.createdAt).format("YYYY-MM-DD")}
            </p>
            <p>
              编程经历：
              {owner.createdAt
                ? (
                    (new Date() - new Date(owner.createdAt)) /
                    1000 /
                    3600 /
                    24 /
                    365
                  ).toFixed(1)
                : ""}
              年
            </p>
            <blockquote>{owner.bio}</blockquote>
            <div>
              状态:<Tag
                color={owner.hireable ? "#4CAF50" : "#FF5722"}
                style={{ marginLeft: "0.5rem" }}
              >
                {!!owner.isHireable ? "待业" : "在职"}
              </Tag>
            </div>
          </Col>
        </Row>

        <div
          style={{
            borderTop: "1px solid #e6e6e6",
            margin: "2rem"
          }}
        />

        <Row>
          <Col md={8} xs={24}>
            <div className="bg-green" style={styles.infoBlock}>
              <span style={styles.strong}>
                {owner.repositories && owner.repositories.totalCount}
              </span>{" "}
              Repositories
            </div>
          </Col>
          <Col md={8} xs={24}>
            <div className="bg-green" style={styles.infoBlock}>
              <span style={styles.strong}>
                {owner.followers && owner.followers.totalCount}
              </span>{" "}
              Followers
            </div>
          </Col>
          <Col md={8} xs={24}>
            <div className="bg-green" style={styles.infoBlock}>
              <span style={styles.strong}>
                {owner.following && owner.following.totalCount}
              </span>{" "}
              Following
            </div>
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(state => ({ OWNER: state.OWNER }), actions)(
  GithubUserInfo
);
