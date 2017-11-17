/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Tooltip, Tag } from 'antd';
import sortBy from 'lodash.sortby';
import Octicon from 'react-octicon';
import moment from 'moment';
import { lazyload } from 'react-lazyload';

import * as allReposAction from '../../redux/all-repos';

import graphql from '../../lib/graphql';

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class GithubRepositories extends Component {
  state = {};
  async componentWillMount() {
    import('@axetroy/react-chart.js').then(module => {
      this.setState({ ReactChart: module.default });
    });
    this.getContributeRepos().then(res => {
      this.setState({ contributedRepositories: res });
    });
    this.getStarredRepos().then(res => {
      let language = {};
      res.nodes.forEach(node => {
        const { primaryLanguage } = node;
        if (primaryLanguage) {
          const { name } = primaryLanguage;
          if (language[name] === void 0) {
            language[name] = {
              ...primaryLanguage,
              ...{ count: 0 }
            };
          } else {
            language[name].count++;
          }
        } else {
        }
      });
      let starredLanguage = [];
      for (const lang in language) {
        starredLanguage.push(language[lang]);
      }
      this.setState({ starredRepositories: res, starredLanguage });
    });
    const repositories = await this.getAllRepos();
    this.props.setAllRepos(repositories.nodes);
  }

  async getAllRepos(
    repositories = {
      totalCount: 0,
      totalDiskUsage: 0,
      nodes: []
    },
    endCursor
  ) {
    try {
      const response = await graphql(`
        query {
          viewer { 
            repositories(privacy:PUBLIC first:100 ${endCursor
              ? 'after:' + '"' + endCursor + '"'
              : ''}){
              totalCount totalDiskUsage
              nodes{
                name url description isFork diskUsage createdAt updatedAt
                owner{
                  login
                }
                watchers(first:0){
                  totalCount
                }
                forks(first:0){
                  totalCount
                }
                stargazers(first:0){
                  totalCount
                }
                primaryLanguage{
                  color name
                }
                languages(first:20){
                  totalCount
                  nodes{
                    color name
                  }
                }
              }
              pageInfo{
                startCursor
                endCursor
                hasNextPage
              }
            }
          }
        }
      `)();

      const {
        pageInfo,
        totalCount,
        totalDiskUsage
      } = response.data.data.viewer.repositories;
      repositories.totalCount = totalCount;
      repositories.totalDiskUsage = totalDiskUsage;
      repositories.nodes = repositories.nodes.concat(
        response.data.data.viewer.repositories.nodes
      );

      // 继续获取下一页
      if (pageInfo.hasNextPage === true) {
        return await this.getAllRepos(repositories, pageInfo.endCursor);
      }
    } catch (err) {
      console.error(err);
    }
    return repositories;
  }

  async getContributeRepos(
    repositories = {
      totalCount: 0,
      nodes: []
    },
    endCursor
  ) {
    try {
      const response = await graphql(`
        query{
          viewer{
            contributedRepositories(first:100 ${endCursor
              ? 'after:' + '"' + endCursor + '"'
              : ''}){
              totalCount
              pageInfo{
                hasNextPage endCursor
              }
              nodes{
                name nameWithOwner url
              }
            }
          }
        }
      `)();

      const { contributedRepositories } = response.data.data.viewer;

      const { pageInfo, totalCount } = contributedRepositories;
      repositories.totalCount = totalCount;
      repositories.nodes = repositories.nodes.concat(
        contributedRepositories.nodes
      );

      // 继续获取下一页
      if (pageInfo.hasNextPage === true) {
        return await this.getContributeRepos(repositories, pageInfo.endCursor);
      }
    } catch (err) {
      console.error(err);
    }
    return repositories;
  }

  async getStarredRepos(
    repositories = {
      totalCount: 0,
      nodes: []
    },
    endCursor
  ) {
    try {
      const response = await graphql(`
        query{
          viewer{
            starredRepositories(first:100 ${endCursor
              ? 'after:' + '"' + endCursor + '"'
              : ''}){
              totalCount
              pageInfo{
                hasNextPage endCursor
              }
              nodes{
                name nameWithOwner url
                primaryLanguage{
                  name color
                }
              }
            }
          }
        }
      `)();

      const { starredRepositories } = response.data.data.viewer;

      const { pageInfo, totalCount } = starredRepositories;
      repositories.totalCount = totalCount;
      repositories.nodes = repositories.nodes.concat(starredRepositories.nodes);

      // 继续获取下一页
      if (pageInfo.hasNextPage === true) {
        return await this.getStarredRepos(repositories, pageInfo.endCursor);
      }
    } catch (err) {
      console.error(err);
    }
    return repositories;
  }

  render() {
    const { ReactChart, contributedRepositories } = this.state;
    const repositories = this.props.ALL_REPOS;
    return (
      <Spin spinning={false}>
        <Row
          className="text-center"
          style={{
            borderBottom: '0.1rem solid #e6e6e6',
            padding: '0 0 2rem 0',
            fontSize: '1.6rem'
          }}
        >
          <Col span={8} style={{ borderRight: '0.1rem solid #e6e6e6' }}>
            <p>
              <Octicon className="font-size-2rem mr5" name="star" mega />
              {repositories
                .map(repo => (repo.stargazers ? repo.stargazers.totalCount : 0))
                .reduce((a, b) => a + b, 0) || 0}
            </p>
            <p>收获Star数</p>
          </Col>
          <Col span={8}>
            <p>
              <Octicon className="font-size-2rem mr5" name="gist-fork" mega />
              {repositories
                .map(repo => (repo.forks ? repo.forks.totalCount : 0))
                .reduce((a, b) => a + b, 0) || 0}
            </p>
            <p>收获Fork数</p>
          </Col>
          <Col
            span={8}
            style={{
              borderLeft: '0.1rem solid #e6e6e6'
            }}
          >
            <p>
              <Octicon className="font-size-2rem mr5" name="repo" mega />
              {repositories.filter(repo => !repo.isFork).length}
            </p>
            <p>原创仓库数</p>
          </Col>
        </Row>
        <Row
          className="text-center"
          style={{
            padding: '2rem 0',
            fontSize: '1.5rem',
            borderBottom: '0.1rem solid #e6e6e6'
          }}
        >
          <Col
            span={12}
            style={{
              borderRight: '0.1rem solid #e6e6e6'
            }}
          >
            <p>
              <Octicon className="font-size-2rem mr5" name="package" mega />
              {(() => {
                const sortByStar = sortBy(
                  repositories,
                  repo => -(repo.stargazers ? repo.stargazers.totalCount : 0)
                );
                const mostStarRepo = sortByStar[0];
                return mostStarRepo
                  ? <Tooltip
                      title={`Star ${mostStarRepo.stargazers
                        ? mostStarRepo.stargazers.totalCount
                        : 0}`}
                    >
                      {mostStarRepo.name}
                    </Tooltip>
                  : '';
              })()}
            </p>
            <p>最受欢迎的仓库</p>
          </Col>
          <Col span={12}>
            {(() => {
              const sortByTime = sortBy(
                repositories,
                repo => -(new Date(repo.updatedAt) - new Date(repo.createdAt))
              );
              const mostLongTimeRepo = sortByTime[0];
              return mostLongTimeRepo
                ? <Tooltip title={mostLongTimeRepo.name} text>
                    <Octicon className="font-size-2rem mr5" name="clock" mega />
                    <span>
                      {moment(mostLongTimeRepo.createdAt).format('YYYY-MM-DD')}
                      ~
                      {moment(mostLongTimeRepo.updatedAt).format('YYYY-MM-DD')}
                    </span>
                  </Tooltip>
                : '';
            })()}
            <p>
              贡献最久的仓库
            </p>
          </Col>
        </Row>
        <Row style={{ padding: '2rem 0' }}>
          <Col md={12} sm={24} xs={24}>
            {(() => {
              const repos = repositories || [];
              const fork = repos.filter(repo => repo.isFork);
              const source = repos.filter(repo => !repo.isFork);
              return ReactChart
                ? <ReactChart
                    type="pie"
                    data={{
                      labels: ['原创仓库', 'Fork'],
                      datasets: [
                        {
                          data: [source.length, fork.length],
                          backgroundColor: ['#4CAF50'],
                          hoverBackgroundColor: ['#4CAF50']
                        }
                      ]
                    }}
                    options={{
                      animation: false,
                      title: {
                        display: true,
                        text: `${(source.length / repos.length * 100).toFixed(
                          0
                        )}% 原创仓库`
                      },
                      cutoutPercentage: 50,
                      legend: {
                        display: false
                      }
                    }}
                  />
                : '';
            })()}
          </Col>
          <Col md={12} sm={24} xs={24}>
            {(() => {
              let repos = sortBy(
                repositories || [],
                repo => -(repo.stargazers ? repo.stargazers.totalCount : 0)
              );
              repos = [].concat(repos).slice(0, 10);
              return ReactChart
                ? <ReactChart
                    type="pie"
                    data={{
                      labels: repos.map(repo => repo.name),
                      datasets: [
                        {
                          data: repos.map(
                            repo =>
                              repo.stargazers ? repo.stargazers.totalCount : 0
                          ),
                          backgroundColor: ['#4CAF50', '#A5D6A7', '#E8F5E9'],
                          hoverBackgroundColor: [
                            '#4CAF50',
                            '#A5D6A7',
                            '#E8F5E9'
                          ]
                        }
                      ]
                    }}
                    options={{
                      animation: false,
                      title: {
                        display: true,
                        text: `Star比例`
                      },
                      cutoutPercentage: 50,
                      legend: {
                        display: false
                      }
                    }}
                  />
                : '';
            })()}
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 16, offset: 4 }}
            lg={{ span: 12, offset: 6 }}
          >
            {(() => {
              const starredLanguage = this.state.starredLanguage;
              return ReactChart && starredLanguage
                ? <ReactChart
                    type="pie"
                    data={{
                      labels: starredLanguage.map(lang => lang.name),
                      datasets: [
                        {
                          data: starredLanguage.map(lang => lang.count),
                          backgroundColor: starredLanguage.map(
                            lang => lang.color
                          ),
                          hoverBackgroundColor: starredLanguage.map(
                            lang => lang.color
                          )
                        }
                      ]
                    }}
                    options={{
                      animation: false,
                      title: {
                        display: true,
                        text: `Star语言偏好`
                      },
                      cutoutPercentage: 50,
                      legend: {
                        display: false
                      }
                    }}
                  />
                : <div className="text-center" style={{ padding: '2rem' }}>
                    Loading...
                  </div>;
            })()}
          </Col>
        </Row>
        <Row
          className="text-center"
          style={{
            borderTop: '0.1rem solid #e6e6e6',
            padding: '2rem  0 0 0',
            fontSize: '1.6rem'
          }}
        >
          <Col span={24}>
            <p>
              参与贡献了{contributedRepositories
                ? contributedRepositories.totalCount
                : 0}个项目:
            </p>
            {contributedRepositories
              ? contributedRepositories.nodes.map(v => {
                  return (
                    <Tag
                      style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                      key={v.nameWithOwner || v.name}
                    >
                      <a href={v.url} target="_blank" rel="nofollow">
                        @{v.nameWithOwner || v.name}
                      </a>
                    </Tag>
                  );
                })
              : <div className="text-center">Loading...</div>}
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      ALL_REPOS: state.ALL_REPOS
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setAllRepos: allReposAction.set
      },
      dispatch
    );
  }
)(GithubRepositories);
