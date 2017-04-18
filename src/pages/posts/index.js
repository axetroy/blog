/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Spin, Pagination, Timeline, Row, Col } from 'antd';
import { Route, NavLink } from 'react-router-dom';

import Post from '../post/';
import github from '../../lib/github';

import * as postAction from '../../redux/posts';

import pkg from '../../../package.json';

const { Sider } = Layout;

const styles = {
  content: {
    background: '#fff',
    padding: '2.4rem',
    margin: 0,
    minHeight: '28rem'
  }
};

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 20,
      total: 0
    }
  };

  async componentWillMount() {
    await this.getPosts(this.state.meta.page, this.state.meta.per_page);
  }

  async getPosts(page, per_page) {
    let posts = this.props.POSTS;
    try {
      const res = await github.get(
        `/repos/${pkg.config.owner}/${pkg.config.repo}/issues`,
        {
          params: { creator: pkg.config.owner, page, per_page }
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

    this.props.setPosts(posts);

    return posts;
  }

  changePage(page, per_page) {
    this.getPosts(page, per_page);
  }

  render() {
    return (
      <Row>
        <Col md={6} xs={24}>
          <Sider width="100%" style={styles.content}>
            <Spin spinning={!this.props.POSTS}>

              <Timeline>
                {this.props.POSTS.map(post => {
                  return (
                    <Timeline.Item key={post.number}>
                      <NavLink
                        exact={true}
                        style={{ color: '#303030' }}
                        activeStyle={{ color: '#FF5722' }}
                        to={`/post/${post.number}`}
                        title={post.title}
                      >
                        {post.title}
                      </NavLink>
                    </Timeline.Item>
                  );
                })}
              </Timeline>

              {this.state.meta.total > 0
                ? <div className="text-center">
                    <Pagination
                      onChange={page =>
                        this.changePage(page, this.state.meta.per_page)}
                      defaultCurrent={this.state.meta.page}
                      defaultPageSize={this.state.meta.per_page}
                      total={this.state.meta.total}
                    />
                  </div>
                : ''}

            </Spin>
          </Sider>
        </Col>

        <Col md={18} xs={24}>
          <div style={styles.content}>
            <Route path="/post/:number" component={Post} />
          </div>
        </Col>

      </Row>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { POSTS: state.POSTS };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setPosts: postAction.set
      },
      dispatch
    );
  }
)(Posts);
