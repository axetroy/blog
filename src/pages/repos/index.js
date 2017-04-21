/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Card, Row, Col, Tag, Pagination, Spin, Menu } from 'antd';
import Octicon from 'react-octicon';
import queryString from 'query-string';
import {
  HashRouter as Router,
  Route,
  Switch,
  HashRouter,
  NavLink
} from 'react-router-dom';

import github from '../../lib/github';
import GithubColors from '../../lib/github-colors.json';
import pkg from '../../../package.json';
import * as repoAction from '../../redux/repos';

import Repo from '../repo';

import './index.css';

const { Content } = Layout;

class Repos extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 24,
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
      <Spin spinning={!this.props.REPOS || !this.props.REPOS.length}>
        <Row>
          <Col span={4}>
            <Menu>
              {this.props.REPOS.map(repo => {
                return (
                  <Menu.Item key={`${repo.owner.login}/${repo.name}`}>
                    <NavLink
                      exact={true}
                      title={repo.name}
                      to={`/repo/${repo.owner.login}/${repo.name}`}
                    >
                      {repo.name}
                    </NavLink>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Col>
          <Col span={20}>
            <Switch>
              <Route exact path="/repo/:owner/:repo" component={Repo} />
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
