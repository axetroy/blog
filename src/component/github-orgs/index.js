/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Popover } from 'antd';
import sortBy from 'lodash.sortby';
import moment from 'moment';

import github from '../../lib/github';

import { store } from '../../redux/orgs';
import { set } from '../../redux/orgs-repos';
import { setStat } from '../../redux/repo-stat';

import pkg from '../../../package.json';

const styles = {
  contributionBar: {
    borderRadius: '0.5rem',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
};

class GithubOrganizations extends Component {
  state = {
    organizations: {},
    currentOrg: null
  };

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async componentWillReceiveProps(nextProp) {}

  async componentWillMount() {
    await this.setStateAsync({ orgsLoading: true });
    // 获取所在的组织列表
    const orgs = await this.getOrganizationsByUser(pkg.config.owner);

    this.setState({
      currentOrg: this.props.orgs[0] ? this.props.orgs[0].login : null
    });

    // 获取单个组织下的仓库
    for (let org of orgs) {
      await this.getRepositoriesByOrg(org.login);
    }

    // 最后进行统计
    const organizations = { ...{}, ...this.props.orgRepos };

    for (let org in organizations) {
      const repositories = organizations[org];

      // stat repo one by one
      for (let repo of repositories) {
        const stats = await this.statRepo(repo.owner.login, repo.name);
        this.props.setRepoStat({ name: repo.name, stat: stats });
      }
    }

    this.setState({ orgsLoading: false });
  }

  async getOrganizationsByUser(owner) {
    let organizations = [];
    try {
      const { data } = await github.get(`/users/${owner}/orgs`);
      const _organizations = (data || []).slice();
      while (_organizations.length) {
        const org = _organizations.shift();
        const { data } = await github.get(`/orgs/${org.login}`); // 获取基本信息
        organizations = organizations.concat([data]);
      }
    } catch (err) {
      console.error(err);
    }
    this.props.storeOrgs(organizations);
    return organizations;
  }

  async getRepositoriesByOrg(org) {
    let repositories = [];
    try {
      const response = await github.get(`/orgs/${org}/repos`);
      repositories = [].concat(response.data);
    } catch (err) {
      console.error(err);
    }
    this.props.setOrgRepos({ name: org, repos: repositories });
    return repositories;
  }

  async statRepo(owner, repo) {
    let contributions = [];

    try {
      const response = await github.get(
        `/repos/${owner}/${repo}/stats/contributors`
      );
      let stats = [].concat(response.data || []);

      stats.forEach(item => {
        const author = item.author;
        const weeks = item.weeks;
        let contribution = {
          add: 0,
          delete: 0,
          changes: 0
        };
        weeks &&
          weeks.forEach(item => {
            contribution.add += item.a; // add
            contribution.delete += item.d; // delete
            contribution.changes = contribution.add + contribution.delete;
          });

        contributions = []
          .concat(contributions)
          .concat([{ author: author, contribution }]);
      });
    } catch (err) {
      console.error(err);
    }

    let total = 0;

    contributions.forEach(v => total += v.contribution.changes);

    return contributions.map(v => {
      v.contribution.total = total;
      return v;
    });
  }

  render() {
    return (
      <Spin spinning={this.state.orgsLoading}>

        <Row>
          {this.props.orgs.map(v => {
            return (
              <Col
                onClick={() => this.setState({ currentOrg: v.login })}
                span={6}
                key={v.login}
                style={{
                  textAlign: 'center',
                  borderBottomWidth: '0.5rem',
                  borderBottomStyle: 'solid',
                  borderBottomColor: this.state.currentOrg === v.login
                    ? '#008000'
                    : '#fff'
                }}
              >
                <div>
                  <img
                    style={{ width: '10rem', maxWidth: '100%' }}
                    src={v.avatar_url}
                    alt=""
                  />
                  <p>{v.login}</p>
                </div>
              </Col>
            );
          })}
        </Row>

        <hr className="hr" />

        <Row>
          <div>
            {this.props.orgs
              .filter(org => org.login === this.state.currentOrg)
              .map(org => {
                return (
                  <div key={org.login}>
                    <p>{org.login}</p>
                    <p>{org.description}</p>
                    <p>
                      创建于 {moment(org.created_at).format('YYYY-MM-DD')}
                    </p>
                  </div>
                );
              })}
          </div>
        </Row>

        <hr className="hr" />

        <Row>
          {sortBy(
            this.props.orgRepos[this.state.currentOrg] || [],
            repo => -repo.watchers_count
          ).map(repo => {
            return (
              <Popover
                key={repo.name}
                title={'详细信息'}
                content={
                  <div>
                    <p>{repo.name}</p>
                    <p>Star {repo.watchers_count}</p>
                    <p>
                      贡献比例
                      {(() => {
                        const stats = this.props.repoStat[repo.name] || [];
                        const myStat = stats.find(
                          stat =>
                            stat &&
                            stat.author &&
                            stat.author.login === pkg.config.owner
                        );
                        if (myStat) {
                          return (myStat.contribution.changes /
                            myStat.contribution.total *
                            100).toFixed(2) + '%';
                        } else {
                          return '0%';
                        }
                      })()}
                    </p>
                  </div>
                }
              >
                <div
                  style={{
                    position: 'relative',
                    padding: '0.5rem',
                    margin: '1rem 0'
                  }}
                >
                  <div
                    className="org-contrib-row"
                    style={styles.contributionBar}
                  >
                    <div
                      className="greasy-bar"
                      style={{
                        ...styles.contributionBar,
                        backgroundColor: '#d2d2d2'
                      }}
                    />
                    <div
                      className="green-bar"
                      style={{
                        ...styles.contributionBar,
                        width: (() => {
                          const stats = this.props.repoStat[repo.name] || [];
                          const myStat = stats.find(
                            stat =>
                              stat &&
                              stat.author &&
                              stat.author.login === pkg.config.owner
                          );
                          if (myStat) {
                            return (myStat.contribution.changes /
                              myStat.contribution.total *
                              100).toFixed(2) + '%';
                          } else {
                            return '0%';
                          }
                        })(),
                        backgroundColor: '#008000'
                      }}
                    />
                  </div>

                  <span style={{ position: 'absolute', color: '#fff' }}>
                    <span> {repo.name} </span>
                  </span>

                  <span>^_^</span>

                </div>
              </Popover>
            );
          })}
        </Row>

      </Spin>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    // console.log(state.orgsRepos);
    return {
      orgs: state.orgs,
      orgRepos: state.orgsRepos,
      repoStat: state.repoStat
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeOrgs: store,
        setOrgRepos: set,
        setRepoStat: setStat
      },
      dispatch
    );
  }
)(GithubOrganizations);
