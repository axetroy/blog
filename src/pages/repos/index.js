/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Pagination, Spin, Card, Tag, Tooltip, Icon } from 'antd';
import queryString from 'query-string';
import { NavLink, withRouter } from 'react-router-dom';
import Octicon from 'react-octicon';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';
import github from '../../lib/github';
import CONFIG from '../../config.json';
import * as repoAction from '../../redux/repos';
import GithubColors from '../../lib/github-colors.json';

import './index.css';

class Repos extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 24,
      total: 0,
    },
  };

  async componentWillMount() {
    const query = queryString.parse(this.props.location.search);
    let { page, per_page } = query;
    page = +page || this.state.meta.page;
    per_page = +per_page || this.state.meta.per_page;
    this.setState({
      meta: {
        ...this.state.meta,
        ...{ page: +page, per_page: +per_page },
      },
    });
    await this.getRepos(page, per_page);
  }

  async getRepos(page, per_page) {
    let repos = [];

    try {
      const { data, headers } = await github.get(
        `/users/${CONFIG.owner}/repos?sort=created`,
        {
          params: { page, per_page },
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8',
          },
        }
      );

      repos = data;

      const link = headers.link;

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
            ...{ page, per_page, total: lastPage * per_page },
          },
        });
      }
    } catch (err) {
      console.error(err);
    }

    this.props.setRepos(repos);

    return repos;
  }

  changePage(page, per_page) {
    const oldQuery = queryString.parse(this.props.location.search);
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(
        Object.assign(oldQuery, { page, per_page })
      ),
    });
    this.getRepos(page, per_page);
  }

  render() {
    return (
      <DocumentTitle title={['开源项目']}>
        <Spin spinning={!this.props.REPOS || !this.props.REPOS.length}>
          <div className={'toolbar-container'}>
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/repos/index.js">
                  <a href="javascript: void 0" target="_blank">
                    <Icon
                      type="code"
                      style={{
                        fontSize: '3rem',
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <Row gutter={8}>
              {this.props.REPOS.map((repo, i) => {
                return (
                  <Col
                    key={`${repo.owner.login}/${repo.name}/${i}`}
                    lg={8}
                    md={8}
                    sm={12}
                    xs={24}
                  >
                    <Card
                      style={{ height: '30rem', margin: '2rem 0' }}
                      className="repo-list"
                    >
                      <NavLink
                        exact={true}
                        to={`/repo/${repo.name}`}
                        style={{
                          color: '#616161',
                          wordBreak: 'break-word',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        <Octicon
                          name={repo.fork ? 'repo-forked' : 'repo'}
                          mega
                          style={{ marginRight: '0.5rem', fontSize: '2rem' }}
                        />
                        {repo.name}
                      </NavLink>
                      <p style={{ color: '#9E9E9E' }}>{repo.description}</p>
                      <div>
                        {(repo.topics || []).map(topic => {
                          return <Tag key={topic}>{topic}</Tag>;
                        })}
                      </div>
                      <div style={{ position: 'absolute', bottom: '1rem' }}>
                        <span>
                          <span
                            className="repo-language-color"
                            style={{
                              backgroundColor: (
                                GithubColors[repo.language] || {}
                              ).color,
                            }}
                          />{' '}
                          {repo.language || 'Unknown'}
                        </span>&nbsp;&nbsp;
                        <span>
                          <Octicon
                            name="star"
                            mega
                            style={{
                              fontSize: '1.4rem',
                              margin: 0,
                            }}
                          />{' '}
                          {repo.watchers_count}
                        </span>&nbsp;&nbsp;
                        <span>
                          <Octicon
                            name="repo-forked"
                            mega
                            style={{
                              fontSize: '1.4rem',
                              margin: 0,
                            }}
                          />{' '}
                          {repo.forks_count}
                        </span>&nbsp;&nbsp;
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            {this.state.meta.total > 0 ? (
              <Row className="text-center">
                <Col span={24} style={{ transition: 'all 1s' }}>
                  <Pagination
                    simple
                    onChange={page =>
                      this.changePage(page, this.state.meta.per_page)
                    }
                    defaultCurrent={this.state.meta.page}
                    defaultPageSize={this.state.meta.per_page}
                    total={this.state.meta.total}
                  />
                </Col>
              </Row>
            ) : (
              ''
            )}
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      REPOS: state.REPOS,
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setRepos: repoAction.setRepos,
      },
      dispatch
    );
  }
)(withRouter(Repos));
