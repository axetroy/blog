/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Menu, Spin, Pagination } from 'antd';
import { Route, NavLink } from 'react-router-dom';

import Post from '../post/';
import github from '../../lib/github';

import { set } from '../../redux/posts';

import pkg from '../../../package.json';

const { Sider, Content } = Layout;

const styles = {
  content: {
    background: '#fff',
    padding: 24,
    margin: 0,
    minHeight: 280
  }
};

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
      total: 0
    },
    loading: false
  };

  async componentWillMount() {
    await this.getPosts(this.state.meta.page, this.state.meta.per_page);
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async getPosts(page, per_page) {
    let posts = this.props.posts;
    try {
      this.setStateAsync({ loading: true });
      const res = await github.get(`/repos/${pkg.config.owner}/blog/issues`, {
        params: { creator: pkg.config.owner, page, per_page }
      });

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

    this.setState({ loading: false });

    return posts;
  }

  changePage(page, per_page) {
    this.getPosts(page, per_page);
  }

  render() {
    return (
      <Layout>
        <Sider width={250} style={styles.content}>
          <Spin spinning={this.state.loading}>
            <Menu mode="inline" style={{ height: '100%' }}>
              {this.props.posts.map((post, index) => {
                return (
                  <Menu.Item key={index}>
                    <NavLink
                      exact={true}
                      activeClassName={'ant-menu-item-selected'}
                      to={`/post/${post.number}`}
                      title={post.title}
                    >
                      {post.title}
                    </NavLink>
                  </Menu.Item>
                );
              })}
            </Menu>

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

        <Content style={styles.content}>
          <Route path="/post/:number" component={Post} />
        </Content>
      </Layout>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { posts: state.posts };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setPosts: set
      },
      dispatch
    );
  }
)(Posts);
