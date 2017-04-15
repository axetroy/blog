/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Card, Row, Col, Tag, Pagination, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Octicon from 'react-octicon';
import queryString from 'query-string';

import github from '../../lib/github';
import GithubColors from '../../lib/github-colors.json';
import pkg from '../../../package.json';
import * as repoAction from '../../redux/repos';

import './index.css';

const { Content } = Layout;

class Repos extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 20,
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
    await this.getRepos(page, per_page);
  }

  async getRepos(page, per_page) {
    let repos = [];

    try {
      const {
        data,
        headers
      } = await github.get(`/users/${pkg.config.owner}/repos?sort=pushed`, {
        params: { page, per_page },
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8'
        }
      });

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
            ...{ page, per_page, total: lastPage * per_page }
          }
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
      search: queryString.stringify(Object.assign(oldQuery, { page, per_page }))
    });
    this.getRepos(page, per_page);
  }

  render() {
    return (
      <Layout>
        <Content
          style={{
            background: '#fff',
            padding: '2.4rem',
            margin: 0,
            minHeight: '28rem'
          }}
        >
          <Spin spinning={!this.props.REPOS || !this.props.REPOS.length}>

            <Row style={{ width: '120rem', margin: '0 auto' }}>

              {this.props.REPOS.map(repo => {
                return (
                  <Link
                    key={`${repo.owner.login}/${repo.name}`}
                    to={`/repo/${repo.owner.login}/${repo.name}`}
                  >
                    <Col span={6}>
                      <Card
                        title={repo.name}
                        extra={
                          <Tag color={repo.fork ? '#108ee9' : '#87d068'}>
                            {repo.fork ? 'Fork' : '原创'}
                          </Tag>
                        }
                        style={{
                          width: '25rem',
                          height: '30rem',
                          display: 'inline-block',
                          margin: '1rem 0',
                          position: 'relative',
                          color: '#303030'
                        }}
                      >

                        <div>
                          <p
                            style={{
                              overflowWrap: 'break-word'
                            }}
                          >
                            {repo.description}
                          </p>
                        </div>

                        <div>
                          {(repo.topics || []).map(topic => {
                            return (
                              <Tag style={{ marginTop: '0.5rem' }} key={topic}>
                                {topic}
                              </Tag>
                            );
                          })}
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            bottom: '1rem'
                          }}
                        >
                          <span className="mr5">
                            <span
                              className="repo-language-color mr5"
                              style={{
                                backgroundColor: GithubColors[repo.language]
                                  ? GithubColors[repo.language].color
                                  : ''
                              }}
                            />
                            <span>
                              {GithubColors[repo.language]
                                ? repo.language
                                : 'Unkown'}
                            </span>
                          </span>
                          <span className="mr5">
                            <Octicon
                              className="font-size-2rem mr5"
                              name="star"
                              mega
                            />
                            <span>{repo.watchers_count}</span>
                          </span>
                          <span className="mr5">
                            <Octicon
                              className="font-size-2rem mr5"
                              name="gist-fork"
                              mega
                            />
                            <span>{repo.forks_count}</span>
                          </span>
                          <span className="mr5">
                            <Octicon
                              className="font-size-2rem mr5"
                              name="issue-opened"
                              mega
                            />
                            <span>{repo.open_issues_count}</span>
                          </span>
                        </div>

                      </Card>
                    </Col>
                  </Link>
                );
              })}

            </Row>

            {this.state.meta.total > 0
              ? <Row>
                  <Col className="text-center">
                    <Pagination
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

        </Content>
      </Layout>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      REPOS: state.REPOS
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setRepos: repoAction.setRepos
      },
      dispatch
    );
  }
)(Repos);
