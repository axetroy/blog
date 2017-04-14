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
    await this.getOrgs(pkg.config.owner);
    this.setState({
      currentOrg: this.props.ORGS[0] ? this.props.ORGS[0].login : null
    }); // 进行统计
    const organizations = {
      ...{},
      ...this.props.ALL_ORG_REPOS
    };
    for (let org in organizations) {
      const repositories = organizations[org];
      // stat repo one by one
      for (let repo of repositories) {
        const stats = await this.statRepo(repo.owner.login, repo.name);
        this.props.setRepoStat({
          name: repo.name,
          stat: stats
        });
      }
    }
  }
  /**
   * 获取owner当前所在的组织列表
   * @param owner
   * @returns {Promise.<Array>}
   */ async getOrgs(
    owner
  ) {
    let organizations = [];
    try {
      const { data } = await github.get(`/users/${owner}/orgs`);
      const _organizations = (data || []).slice();
      while (_organizations.length) {
        const org = _organizations.shift(); // 获取基本信息
        const { data } = await github.get(`/orgs/${org.login}`); // 获取该组织下, 所有的项目
        await [this.getOrgAllRepos(org.login), this.getOrgMembers(org.login)];
        // 获取组织内公开的所有成员
        organizations = organizations.concat([data]);
      }
    } catch (err) {
      console.error(err);
    }
    this.props.storeOrgs(organizations);
    return organizations;
  } /**
  /**
   * 统计一个仓库
   * @param owner
   * @param repo
   * @returns {Promise.<Array>}
   */
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
  } /**
   * 获取组织的所有成员列表
   * @param org
   * @returns {Promise.<Array>}
   */
  async getOrgMembers(org) {
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
  } /**
   * 获取组织的所有仓库
   * @param org
   * @param page
   * @returns {Promise.<*>}
   */
  async getOrgAllRepos(org, page = 1) {
    let repos = [];
    try {
      const { data, headers } = await github.get(`/orgs/${org}/repos`, {
        params: {
          page
        }
      });
      repos = data;
      const { link } = headers;
      if (link && /rel=['"]next['"]/.test(link)) {
        return repos.concat(await this.getOrgAllRepos(page + 1));
      }
    } catch (err) {
      console.error(err);
    }
    this.props.setOrgAllRepos({
      name: org,
      repos
    });
    return repos;
  } /**
   * 渲染元信息
   * @returns {XML}
   */
  orgMetaRender() {
    return (
      <Row
        className="text-center"
        style={{
          ...styles.orgRow,
          ...{ fontSize: '1.5rem' }
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
              const currentOrg = this.props.ORGS.find(
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
              const currentOrg = this.props.ALL_ORG_REPOS[
                this.state.currentOrg
              ];
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
    );
  }
  /**
   * 渲染组织列表
   * @returns {XML}
   */ orgListRender() {
    return (
      <Row style={styles.orgRow}>
        {this.props.ORGS.map(v => {
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
    );
  } /**
   * 渲染组织的介绍
   * @returns {XML}
   */
  orgDescRender() {
    return (
      <Row style={styles.orgRow}>
        <div>
          {this.props.ORGS
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
    );
  }
  /**
   * 渲染组织的仓库列表
   * @returns {XML}
   */ orgReposRender() {
    return (
      <Row style={styles.orgRow}>
        {(() => {
          let repos = sortBy(
            this.props.ALL_ORG_REPOS[this.state.currentOrg] || [],
            repo => -repo.watchers_count
          );
          repos.length = 10;
          return repos.map(repo => {
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
                        const stats = this.props.REPOS_STAT[repo.name] || [];
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
                          const stats = this.props.REPOS_STAT[repo.name] || [];
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
          });
        })()}
      </Row>
    );
  }
  render() {
    return (
      <Spin spinning={!this.props.ALL_ORG_REPOS}>

        {this.orgMetaRender()}

        {this.orgListRender()}

        {this.orgDescRender()}

        {this.orgReposRender()}

      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      ORGS: state.ORGS,
      REPOS_STAT: state.REPOS_STAT,
      ALL_ORG_REPOS: state.ALL_ORG_REPOS
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeOrgs: store,
        setRepoStat: setStat,
        setOrgAllRepos: allOrgRepos.set
      },
      dispatch
    );
  }
)(GithubOrganizations);
