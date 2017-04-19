/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Tag } from 'antd';
import moment from 'moment';

import github from '../../lib/github';
import * as userAction from '../../redux/owner';
import pkg from '../../../package.json';

const styles = {
  infoBlock: {
    width: '80%',
    margin: '1rem auto',
    textAlign: 'center',
    color: '#fff',
    padding: '2rem'
  },
  strong: { fontSize: '2em' }
};

class GithubUserInfo extends Component {
  async componentWillMount() {
    try {
      const response = await github.get(`/users/${pkg.config.owner}`);
      this.props.storeOwnerInfo(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  changePage(page, per_page) {
    this.getFollowings(page, per_page);
  }

  render() {
    return (
      <Spin spinning={!this.props.OWNER}>
        <Row>
          <Col span={4}>
            <a href={this.props.OWNER.html_url} target="_blank">
              <img
                alt={this.props.OWNER.avatar_url}
                style={{
                  width: '70%',
                  height: 'auto',
                  borderRadius: '50%',
                  verticalAlign: 'middle'
                }}
                src={this.props.OWNER.avatar_url}
              />
            </a>
          </Col>
          <Col span={20}>
            <p>{this.props.OWNER.name}</p>
            <p>
              加入时间：
              {this.props.OWNER.created_at &&
                moment(this.props.OWNER.created_at).format('YYYY-MM-DD')}
            </p>
            <p>
              编程经历：
              {this.props.OWNER.created_at
                ? ((new Date() - new Date(this.props.OWNER.created_at)) /
                    1000 /
                    3600 /
                    24 /
                    365).toFixed(1)
                : ''}
              年
            </p>
            <blockquote>
              {this.props.OWNER.bio}
            </blockquote>
            <div>
              状态:<Tag color={this.props.OWNER.hireable ? '#4CAF50' : '#FF5722'}>
                {!!this.props.OWNER.hireable ? '待业' : '在职'}
              </Tag>
            </div>
          </Col>
        </Row>

        <div
          style={{
            borderTop: '1px solid #e6e6e6',
            margin: '2rem'
          }}
        />

        <Row>
          <Col md={8} xs={24}>
            <div className="bg-green" style={styles.infoBlock}>
              <span style={styles.strong}>
                {this.props.OWNER.public_repos}
              </span>
              {' '}
              Repositories
            </div>
          </Col>
          <Col md={8} xs={24}>
            <div className="bg-green" style={styles.infoBlock}>
              <span style={styles.strong}>
                {this.props.OWNER.followers}
              </span>
              {' '}
              Followers
            </div>
          </Col>
          <Col md={8} xs={24}>
            <div className="bg-green" style={styles.infoBlock}>
              <span style={styles.strong}>
                {this.props.OWNER.following}
              </span>
              {' '}
              Following
            </div>
          </Col>
        </Row>

      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { OWNER: state.OWNER };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeOwnerInfo: userAction.store
      },
      dispatch
    );
  }
)(GithubUserInfo);
