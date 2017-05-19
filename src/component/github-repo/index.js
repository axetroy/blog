/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Tooltip } from 'antd';
import sortBy from 'lodash.sortby';
import Octicon from 'react-octicon';
import moment from 'moment';
import { lazyload } from 'react-lazyload';

import * as allReposAction from '../../redux/all-repos';

import github from '../../lib/github';
import CONFIG from '../../config.json';

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class GithubRepositories extends Component {
  state = {};
  async componentWillMount() {
    require.ensure(
      ['chart.js'],
      require => {
        const ReactChart = require('@axetroy/react-chart.js');
        this.setState({ ReactChart: ReactChart.default });
      },
      'react-chart'
    );
    const allRepos = await this.getAllRepos(1);
    this.props.setAllRepos(allRepos);
  }

  async getAllRepos(page) {
    let repos = [];
    try {
      const {
        data,
        headers
      } = await github.get(`/users/${CONFIG.owner}/repos`, {
        params: { page }
      });
      repos = data;
      const { link } = headers;
      if (link && /rel=['"]next['"]/.test(link)) {
        return repos.concat(await this.getAllRepos(page + 1));
      }
    } catch (err) {
      console.error(err);
    }
    return repos;
  }

  render() {
    const { ReactChart } = this.state;
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
              {this.props.ALL_REPOS
                .map(repo => repo.watchers_count)
                .reduce((a, b) => a + b, 0) || 0}
            </p>
            <p>收获Star数</p>
          </Col>
          <Col span={8}>
            <p>
              <Octicon className="font-size-2rem mr5" name="gist-fork" mega />
              {this.props.ALL_REPOS
                .map(repo => repo.forks_count)
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
              {this.props.ALL_REPOS.filter(repo => !repo.fork).length}
            </p>
            <p>创建的仓库数</p>
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
                  this.props.ALL_REPOS,
                  repo => -repo.watchers_count
                );
                const mostStarRepo = sortByStar[0];
                return mostStarRepo
                  ? <Tooltip title={`Star ${mostStarRepo.watchers_count}`}>
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
                this.props.ALL_REPOS,
                repo => -(new Date(repo.updated_at) - new Date(repo.created_at))
              );
              const mostLongTimeRepo = sortByTime[0];
              return mostLongTimeRepo
                ? <Tooltip title={mostLongTimeRepo.name} text>
                    <Octicon className="font-size-2rem mr5" name="clock" mega />
                    <span>
                      {moment(mostLongTimeRepo.created_at).format('YYYY-MM-DD')}
                      ~
                      {moment(mostLongTimeRepo.updated_at).format('YYYY-MM-DD')}
                    </span>
                  </Tooltip>
                : '';
            })()}
            <p>
              贡献最久的仓库
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24} xs={24}>
            {(() => {
              const repos = this.props.ALL_REPOS || [];
              const fork = repos.filter(repo => repo.fork);
              const source = repos.filter(repo => !repo.fork);
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
                        text: `${(source.length / repos.length * 100).toFixed(0)}% 原创仓库`
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
                this.props.ALL_REPOS || [],
                repo => -repo.watchers_count
              );
              repos = [].concat(repos).slice(0, 10);
              return ReactChart
                ? <ReactChart
                    type="pie"
                    data={{
                      labels: repos.map(repo => repo.name),
                      datasets: [
                        {
                          data: repos.map(repo => repo.watchers_count),
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
