/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Pagination, Row, Col, Menu } from 'antd';
import { Route, Switch, NavLink } from 'react-router-dom';

import Post from '../post/';
import github from '../../lib/github';

import * as postAction from '../../redux/posts';

import pkg from '../../../package.json';

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 50,
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
    const { pathname } = this.props.location;

    const matcher = pathname.match(/\/post\/(\d+)/);

    const number = matcher ? matcher[1] : null;

    return (
      <Spin spinning={false}>
        <Row className={'h100'}>
          <Col sm={4} xs={!number ? 24 : 0} className={'h100'}>
            <Menu
              mode="inline"
              className={'h100'}
              style={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
              {this.props.POSTS.map((post, i) => {
                return (
                  <Menu.Item
                    key={post.number + '/' + i}
                    className={
                      +number === +post.number ? 'ant-menu-item-selected' : ``
                    }
                  >
                    <NavLink
                      exact={true}
                      to={`/post/${post.number}`}
                      title={post.title}
                      style={{
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </NavLink>
                  </Menu.Item>
                );
              })}

              <Menu.Item>
                {this.state.meta.total > 0
                  ? <Row className="text-center">
                      <Col span={24}>
                        <Pagination
                          simple
                          onChange={page =>
                            this.changePage(page, this.state.meta.per_page)}
                          defaultCurrent={this.state.meta.page}
                          defaultPageSize={this.state.meta.per_page}
                          total={this.state.meta.total}
                        />
                      </Col>
                    </Row>
                  : ''}
              </Menu.Item>
            </Menu>
          </Col>

          <Col
            sm={20}
            xs={number ? 24 : 0}
            className={'h100'}
            style={{
              overflowY: 'auto'
            }}
          >
            <Switch>
              <Route path="/post/:number" component={Post} />
            </Switch>
          </Col>

        </Row>
      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      POSTS: state.POSTS
    };
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
