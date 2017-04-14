/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Popover } from 'antd';
import sortBy from 'lodash.sortby';
import Octicon from 'react-octicon';
import moment from 'moment';

import github from '../../lib/github';

import { store } from '../../redux/orgs';
import { set } from '../../redux/orgs-repos';
import { setStat } from '../../redux/repo-stat';
import * as allOrgRepos from '../../redux/all-orgs-repos';

import pkg from '../../../package.json';

const styles = {
  contributionBar: {
    borderRadius: '0.5rem',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  orgRow: {
    padding: '2rem 0',
    borderBottom: '0.1rem solid #e6e6e6'
  }
};

class GithubOrganizations extends Component {
  state = {
    currentOrg: null,
    orgMemberShip: {}
  };

  async componentWillReceiveProps(nextProp) {
    if (nextProp.orgs && nextProp.orgs.length) {
      const current = nextProp.orgs[0];
      current &&
        !this.state.currentOrg &&
        this.setState({ currentOrg: current.login, a: 22 });
    }
  }

  async componentWillMount() {
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
    const organizations = {
      ...{},
      ...this.props.orgRepos
    };
    for (let org in organizations) {
      const repositories = organizations[org]; // stat repo one by one
      for (let repo of repositories) {
        const stats = await this.statRepo(repo.owner.login, repo.name);
        this.props.setRepoStat({
          name: repo.name,
          stat: stats
        });
      }
    }
  }
  async getOrganizationsByUser(owner) {
    let organizations = [];
    try {
      const { data } = await github.get(`/users/${owner}/orgs`);
      const _organizations = (data || []).slice();
      while (_organizations.length) {
        const org = _organizations.shift();
        const { data } = await github.get(`/orgs/${org.login}`); // 获取基本信息
        await this.getOrgAllMemberShip(org.login); // 获取组织内公开的所有成员
        await this.getOrgAllRepos(org.login); // 获取该组织下, 所有的项目
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
    this.props.setOrgRepos({
      name: org,
      repos: repositories
    });
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
        contributions = [].concat(contributions).concat([
          {
            author: author,
            contribution
          }
        ]);
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
  async getOrgAllMemberShip(org) {
    let allMemberShip = [];
    try {
      const { data, headers } = await github.get(`/orgs/${org}/public_members`);
      const { link } = headers;
      allMemberShip = data;
      if (link) {
        // TODO 直接获取最后一页, 可得到组织的总人数
      }
    } catch (err) {
      console.error(err);
    }
    this.setState({
      orgMemberShip: {
        ...this.state.orgMemberShip,
        ...{
          [org]: allMemberShip
        }
      }
    });
    return allMemberShip;
  }
  async getOrgAllRepos(org, page = 1) {
    let repos = [];
    try {
      const { data, headers } = await github.get(`/orgs/${org}/repos`, {
        params: { page }
      });
      repos = data;
      const { link } = headers;
      if (link && /rel=['"]next['"]/.test(link)) {
        return repos.concat(await this.getOrgAllRepos(page + 1));
      }
    } catch (err) {
      console.error(err);
    }
    this.props.setOrgAllRepos({ name: org, repos });
    return repos;
  }
  render() {
    return (
      <Spin spinning={!this.props.orgRepos}>

        <Row
          className="text-center"
          style={{
            ...styles.orgRow,
            ...{
              fontSize: '1.5rem'
            }
          }}
        >
          <Col
            span={8}
            style={{
              borderRight: '0.1rem solid #e6e6e6'
            }}
          >
            <p>
              <Octicon className="font-size-2rem mr5" name="mention" mega />
              {this.state.orgMemberShip[this.state.currentOrg]
                ? this.state.orgMemberShip[this.state.currentOrg].length
                : 1}
            </p>
            <p>成员数</p>
          </Col>
          <Col span={8}>
            <p>
              <Octicon className="font-size-2rem mr5" name="repo" mega />
              {(() => {
                const currentOrg = this.props.orgs.find(
                  org => org.login === this.state.currentOrg
                );
                return currentOrg ? currentOrg.public_repos : 0;
              })()}
            </p>
            <p>项目数</p>
          </Col>
          <Col
            span={8}
            style={{
              borderLeft: '0.1rem solid #e6e6e6'
            }}
          >
            <p>
              <Octicon className="font-size-2rem mr5" name="star" mega />
              {(() => {
                const currentOrg = this.props.orgRepos[this.state.currentOrg];
                if (currentOrg) {
                }
                return currentOrg
                  ? currentOrg
                      .map(repo => repo.watchers_count)
                      .reduce((a, b) => a + b, 0)
                  : 0;
              })()}
            </p>
            <p>收获star数</p>
          </Col>
        </Row>

        <Row style={styles.orgRow}>
          {this.props.orgs.map(v => {
            return (
              <Col
                onClick={() =>
                  this.setState({
                    currentOrg: v.login
                  })}
                span={6}
                key={v.login}
                style={{
                  textAlign: 'center',
                  borderBottomWidth: '0.3rem',
                  borderBottomStyle: 'solid',
                  borderBottomColor: this.state.currentOrg === v.login
                    ? '#008000'
                    : '#fff'
                }}
              >
                <div>
                  <img
                    style={{
                      width: '10rem',
                      maxWidth: '100%'
                    }}
                    src={v.avatar_url}
                    alt=""
                  />
                  <p>{v.login}</p>
                </div>
              </Col>
            );
          })}
        </Row>

        <Row style={styles.orgRow}>
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

        <Row style={styles.orgRow}>
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
                          return (
                            (myStat.contribution.changes /
                              myStat.contribution.total *
                              100).toFixed(2) + '%'
                          );
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
                            return (
                              (myStat.contribution.changes /
                                myStat.contribution.total *
                                100).toFixed(2) + '%'
                            );
                          } else {
                            return '0%';
                          }
                        })(),
                        backgroundColor: '#008000'
                      }}
                    />
                  </div>

                  <span
                    style={{
                      position: 'absolute',
                      color: '#fff'
                    }}
                  >
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
        // 储存仓库列表
        setOrgRepos: set,
        // 组织一个组织的第一页仓库列表
        setRepoStat: setStat,
        // 储存一个仓库的统计报告
        setOrgAllRepos: allOrgRepos.set // 存储一个组织所有的项目
      },
      dispatch
    );
  }
)(GithubOrganizations);
