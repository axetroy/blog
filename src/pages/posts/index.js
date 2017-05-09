/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Pagination, Row, Col, Card, Tag, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import queryString from 'query-string';
import LazyLoad from 'react-lazyload';

import DocumentTitle from '../../component/document-title';
import github from '../../lib/github';
import { firstUpperCase } from '../../lib/utils';

import * as postAction from '../../redux/posts';

import pkg from '../../../package.json';

import './index.css';

class Posts extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
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
    let posts = this.props.POSTS;
    try {
      const res = await github.get(
        `/repos/${pkg.config.owner}/${pkg.config.repo}/issues`,
        {
          params: { creator: pkg.config.owner, page, per_page, state: 'open' }
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
    const oldQuery = queryString.parse(this.props.location.search);
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page, per_page }))
    });
    this.getPosts(page, per_page);
  }

  render() {
    return (
      <DocumentTitle title="博客文章">
        <Spin spinning={false}>
          {this.props.POSTS.map((post, i) => {
            return (
              <Card
                style={{ margin: '2rem 0' }}
                className="post-list"
                key={post.number + '/' + i}
              >
                <div>
                  <h3 className="post-title">
                    <NavLink
                      exact={true}
                      to={`/post/${post.number}`}
                      title={post.title}
                      style={{
                        wordBreak: 'break-word',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </NavLink>
                    <span style={{ marginLeft: '1rem' }}>
                      {(post.labels || []).map(label => {
                        return (
                          <Tag key={label.id} color={'#' + label.color}>
                            {label.name}
                          </Tag>
                        );
                      })}
                    </span>
                  </h3>
                </div>
                <div style={{ color: '#9E9E9E' }}>
                  {post.body.slice(0, 500)}...
                </div>
                <div
                  style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e6e6e6'
                  }}
                >
                  {post.user.avatar_url
                    ? <LazyLoad height={44}>
                        <img
                          src={post.user.avatar_url}
                          alt=""
                          style={{
                            width: '4.4rem',
                            height: '100%',
                            borderRadius: '50%',
                            marginRight: '0.5rem',
                            verticalAlign: 'middle'
                          }}
                        />
                      </LazyLoad>
                    : ''}
                  <div
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    <strong>
                      <Icon
                        type="user"
                        style={{
                          marginRight: '0.5rem'
                        }}
                      />{firstUpperCase(post.user.login)}
                    </strong>
                    <p>
                      <Icon type="calendar" style={{ marginRight: '0.5rem' }} />
                      {moment(new Date(post.created_at)).fromNow()}
                    </p>
                    <p>
                      <Icon type="message" style={{ marginRight: '0.5rem' }} />
                      {post.comments}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {this.state.meta.total > 0
            ? <Row className="text-center">
                <Col span={24} style={{ transition: 'all 1s' }}>
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

        </Spin>
      </DocumentTitle>
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
