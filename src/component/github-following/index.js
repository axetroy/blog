/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Pagination } from 'antd';
import { lazyload } from 'react-lazyload';

import github from '../../lib/github';
import graphql from '../../lib/graphql';
import { storeFollowings } from '../../redux/following';

import CONFIG from '../../config.json';

@lazyload({
  height: 200,
  offset: 100,
  once: true,
})
class GithubFollowing extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 30,
    },
  };

  async componentWillMount() {
    // await this.getFollowings(this.state.meta.page, this.state.meta.per_page);

    const response = await graphql(
      `
query {
  viewer {
    following(first:${this.state.meta.per_page}){
      nodes{
        login url avatarUrl
      }
      pageInfo{
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
    followers(first:${this.state.meta.per_page}){
      nodes{
        login url avatarUrl
      }
      pageInfo{
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
    `
    )();

    this.props.storeFollowings(response.data.data.viewer.following.nodes);
  }

  async getFollowings(page, per_page) {
    let followings = [];
    try {
      const { data, headers } = await github.get(
        `/users/${CONFIG.owner}/following`,
        {
          params: { page, per_page },
        }
      );
      followings = data;

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
            ...{ page, per_page, total: lastPage * per_page },
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
    this.setState({
      meta: {
        ...this.state.meta,
        ...{ page, per_page },
      },
    });
    if (page === 1) this.props.storeFollowings(followings);
    return followings;
  }

  changePage(page, per_page) {
    this.getFollowings(page, per_page);
  }

  render() {
    const followings = this.props.FOLLOWING;
    return (
      <Spin spinning={!followings || !followings.length}>
        <Row>
          {followings.map(user => {
            return (
              <Col
                className="text-center"
                md={4}
                sm={6}
                xs={6}
                key={user.login}
              >
                <a href={user.url} target="_blank">
                  <img
                    src={user.avatarUrl}
                    style={{ width: '10rem', maxWidth: '100%' }}
                    alt=""
                  />
                  <br />
                  <sub>{user.login}</sub>
                </a>
              </Col>
            );
          })}
        </Row>
        {this.state.meta.total > 0 ? (
          <Row className="text-center">
            <Pagination
              onChange={page => this.changePage(page, this.state.meta.per_page)}
              defaultCurrent={this.state.meta.page}
              defaultPageSize={this.state.meta.per_page}
              total={this.state.meta.total}
            />
          </Row>
        ) : (
          ''
        )}
      </Spin>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { FOLLOWING: state.FOLLOWING };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeFollowings: storeFollowings,
      },
      dispatch
    );
  }
)(GithubFollowing);
