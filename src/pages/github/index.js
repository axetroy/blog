/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GitHubCalendar from 'github-calendar';
import { Row, Col, Card, Spin, Tag } from 'antd';
import moment from 'moment';

import github from '../../lib/github';
import GithubFollowers from '../../component/github-followers';
import GithubFollowing from '../../component/github-following';
import GithubRepositories from '../../component/github-repo';
import GithubOrgs from '../../component/github-orgs';

import { store } from '../../redux/owner';

import './index.css';

import pkg from '../../../package.json';

const styles = {
  infoBlock: {
    width: '80%',
    margin: '0 auto',
    textAlign: 'center',
    color: '#fff',
    padding: 20
  },
  strong: { fontSize: '2em' }
};

class Github extends Component {
  componentDidMount() {
    GitHubCalendar('.calendar', pkg.config.owner);
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async componentWillMount() {
    let user = {};
    try {
      const response = await github.get(`/users/${pkg.config.owner}`);
      user = response.data;
    } catch (err) {
      console.error(err);
    }
    this.props.storeOwnerInfo(user);
    return user;
  }

  render() {
    return (
      <Row style={{ width: 750, margin: '0 auto' }}>

        <h2 className="github-title">
          活跃度
        </h2>

        <div className="calendar" />

        <h2 className="github-title">
          基本信息
        </h2>

        <Card style={{ width: '100%' }}>
          <Spin spinning={!this.props.user}>
            <Row>
              <Col span={4}>
                <a href={this.props.user.html_url} target="_blank">
                  <img
                    alt={this.props.user.avatar_url}
                    style={{
                      width: '70%',
                      height: 'auto',
                      borderRadius: '50%'
                    }}
                    src={this.props.user.avatar_url}
                  />
                </a>
              </Col>
              <Col span={20}>
                <p>{this.props.user.name}</p>
                <p>
                  加入时间：
                  {this.props.user.created_at &&
                    moment(this.props.user.created_at).format('YYYY-MM-DD')}
                </p>
                <p>
                  编程经历：
                  {this.props.user.created_at
                    ? ((new Date() - new Date(this.props.user.created_at)) /
                        1000 /
                        3600 /
                        24 /
                        365).toFixed(1)
                    : ''}
                  年
                </p>
                <blockquote>
                  {this.props.user.bio}
                </blockquote>
                <div>
                  状态:<Tag
                    color={this.props.user.hireable ? '#4CAF50' : '#FF5722'}
                  >
                    {!!this.props.user.hireable ? '待业' : '在职'}
                  </Tag>
                </div>
              </Col>
            </Row>

            <hr className="hr" />

            <Row>
              <Col span={8}>
                <div className="bg-green" style={styles.infoBlock}>
                  <span style={styles.strong}>
                    {this.props.user.public_repos}
                  </span>
                  {' '}
                  Repositories
                </div>
              </Col>
              <Col span={8}>
                <div className="bg-green" style={styles.infoBlock}>
                  <span style={styles.strong}>
                    {this.props.user.followers}
                  </span>
                  {' '}
                  Followers
                </div>
              </Col>
              <Col span={8}>
                <div className="bg-green" style={styles.infoBlock}>
                  <span style={styles.strong}>
                    {this.props.user.following}
                  </span>
                  {' '}
                  Following
                </div>
              </Col>
            </Row>

          </Spin>
        </Card>

        <h2 className="github-title">仓库信息</h2>
        <Card>
          <GithubRepositories />
        </Card>

        <h2 className="github-title">隶属组织</h2>
        <Card>
          <GithubOrgs />
        </Card>

        <h2 className="github-title">追寻的大牛</h2>
        <Card>
          <GithubFollowing />
        </Card>

        <h2 className="github-title">感谢支持我的人</h2>
        <Card>
          <GithubFollowers />
        </Card>

      </Row>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { user: state.owner };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeOwnerInfo: store
      },
      dispatch
    );
  }
)(Github);
