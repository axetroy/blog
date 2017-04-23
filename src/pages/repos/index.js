/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Tag, Pagination, Spin, Menu } from 'antd';
import queryString from 'query-string';
import { Route, Switch, NavLink } from 'react-router-dom';
import github from '../../lib/github';
import pkg from '../../../package.json';
import * as repoAction from '../../redux/repos';

import Repo from '../repo';

import './index.css';

class Repos extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 50,
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
    const { pathname } = this.props.location;

    const matcher = pathname.match(/\/repo\/([^\/]+)/);

    const repoNameOnUrl = matcher ? matcher[1] : null;

    return (
      <Spin spinning={!this.props.REPOS || !this.props.REPOS.length}>
        <Row className={'h100'}>
          <Col
            xl={4}
            lg={6}
            md={8}
            sm={8}
            xs={!repoNameOnUrl ? 24 : 0}
            className={'h100'}
          >
            <Menu
              mode="inline"
              className={'h100'}
              style={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
              {this.props.REPOS.map((repo, i) => {
                return (
                  <Menu.Item
                    key={`${repo.owner.login}/${repo.name}/${i}`}
                    className={
                      repoNameOnUrl === repo.name
                        ? 'ant-menu-item-selected'
                        : ''
                    }
                  >
                    <NavLink
                      exact={true}
                      to={`/repo/${repo.name}`}
                      style={{
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      <Tag color={repo.fork ? 'blue' : 'green'}>
                        {repo.fork ? 'Fork' : 'Source'}
                      </Tag>
                      {repo.name}
                    </NavLink>
                  </Menu.Item>
                );
              })}

              {this.state.meta.total > 0
                ? <Menu.Item>
                    <Row className="text-center">
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
                  </Menu.Item>
                : ''}

            </Menu>
          </Col>
          <Col
            xl={20}
            lg={18}
            md={16}
            sm={16}
            xs={repoNameOnUrl ? 24 : 0}
            className={'h100'}
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
          >
            <Switch>
              <Route exact path="/repo/:repo" component={Repo} />
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
