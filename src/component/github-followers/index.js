/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col, Spin, Pagination } from 'antd';

import github from '../../lib/github';

import pkg from '../../../package.json';

class GithubFollowers extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 30
    },
    followers: [],
    followersLoading: false
  };

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async componentWillMount() {
    await this.getFollowers(this.state.meta.page, this.state.meta.per_page);
  }

  async getFollowers(page, per_page) {
    let followers = [];
    try {
      await this.setStateAsync({ followersLoading: true });
      const { data, headers } = await github.get(`/users/${pkg.config.owner}/followers`, {
        params: { page, per_page }
      });
      followers = data;

      /**
       * Pagination
       * # see detail https://developer.github.com/guides/traversing-with-pagination/
       */
      if (headers.link) {
        const last = headers.link.match(/<([^>]+)>(?=\;\s+rel="last")/);
        const lastPage = last ? last[1].match(/page=(\d+)/)[1] : page;
        this.setState({
          meta: {
            ...this.state.meta,
            ...{ page, per_page, total: lastPage * per_page }
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
    this.setState({
      followers,
      followersLoading: false,
      meta: {
        ...this.state.meta,
        ...{ page, per_page }
      }
    });
    return followers;
  }

  renderFollowers() {
    return this.state.followers.map(user => {
      return (
        <Col className="text-center" span={4} key={user.login}>
          <a href={user.html_url} target="_blank">
            <img
              src={user.avatar_url}
              style={{ width: '10rem', maxWidth: '100%' }}
              alt=""
            />
            <br />
            <sub>{user.login}</sub>
          </a>
        </Col>
      );
    });
  }

  changePage(page, per_page) {
    return this.getFollowers(page, per_page);
  }

  render() {
    return (
      <Spin spinning={this.state.followersLoading}>
        <Row>
          {this.renderFollowers()}
        </Row>
        {this.state.meta.total > 0
          ? <Row className="text-center">
              <Pagination
                onChange={page =>
                  this.changePage(page, this.state.meta.per_page)}
                defaultCurrent={this.state.meta.page}
                defaultPageSize={this.state.meta.per_page}
                total={this.state.meta.total}
              />
            </Row>
          : ''}
      </Spin>
    );
  }
}

export default GithubFollowers;
