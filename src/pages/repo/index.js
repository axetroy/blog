/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin, Tabs, Tag } from 'antd';
import Octicon from 'react-octicon';
import moment from 'moment';

const TabPane = Tabs.TabPane;

import github from '../../lib/github';
import RepoReadme from '../../component/repo-readme';
import RepoEvents from '../../component/repo-events';
import GithubLangIngredient from '../../component/github-lang-ingredient';

import pkg from '../../../package.json';

import './index.css';

class Repo extends Component {
  state = {
    repo: {},
    readme: '',
    events: [],
    repoLoading: false
  };

  async componentWillMount() {
    await this.getData(this.props);
  }

  async componentWillReceiveProps(nextProp) {
    const { repo } = nextProp.match.params;
    if (repo && repo !== this.props.match.params.repo) {
      await this.getData(nextProp);
    }
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async getData(props) {
    if (this.state.loading) return;
    const { repo } = props.match.params;
    const data = await this.getRepo(pkg.config.owner, repo);
    await this.getLang(data.owner.login, data.name);
  }

  async getRepo(owner, repo) {
    let data = null;
    try {
      await this.setStateAsync({ repoLoading: true });
      const res = await github.get(`/repos/${owner}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8'
        }
      });
      data = res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
    this.setState({ repo: data || {}, repoLoading: false });
    return data;
  }

  async getLang(owner, repo) {
    let languages = {};
    try {
      const { data } = await github.get(`/repos/${owner}/${repo}/languages`);
      languages = data;
      this.setState({ languages: data });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const metas = [
      {
        icon: 'eye',
        field: 'subscribers_count'
      },
      {
        icon: 'star',
        field: 'watchers_count'
      },
      {
        icon: 'repo-forked',
        field: 'forks_count'
      },
      {
        icon: 'issue-opened',
        field: 'open_issues_count'
      }
    ];

    return (
      <div>
        <Spin spinning={this.state.repoLoading} delay={0} tip="Loading...">
          <div>
            <h1>
              <a target="_blank" href={this.state.repo.html_url}>
                {this.state.repo.name}
              </a>
              &nbsp;
              {metas.map(meta => {
                return (
                  <span
                    key={meta.field}
                    className="mr5"
                    style={{
                      fontSize: '1.4rem'
                    }}
                  >
                    <Octicon
                      className="mr5"
                      name={meta.icon}
                      mega
                      style={{
                        fontSize: '1.4rem'
                      }}
                    />
                    {meta.icon === 'home'
                      ? <a href={this.state.repo.homepage} target="_blank">
                          {this.state.repo.homepage}
                        </a>
                      : this.state.repo[meta.field]}
                  </span>
                );
              })}
            </h1>

            <GithubLangIngredient languages={this.state.languages} />

            <div className="github-meta">
              <span>{this.state.repo.description}</span>
              &nbsp;
              &nbsp;
              {this.state.repo.homepage
                ? <a href={this.state.repo.homepage} target="_blank">
                    {this.state.repo.homepage}
                  </a>
                : ''}
            </div>

            <div className="github-meta">
              <div>
                {(this.state.repo.topics || []).map(topic => {
                  return (
                    <Tag style={{ marginTop: '0.5rem' }} key={topic}>
                      {topic}
                    </Tag>
                  );
                })}
              </div>
            </div>

            <div className="github-meta">
              Create at
              {' '}
              {this.state.repo.created_at &&
                moment(this.state.repo.created_at).fromNow()}
            </div>
            <div className="github-meta">
              Update at
              {' '}
              {this.state.repo.updated_at &&
                moment(this.state.repo.updated_at).fromNow()}
            </div>
          </div>
        </Spin>
        <div>
          <Tabs defaultActiveKey="readme">
            <TabPane tab="项目介绍" key="readme">
              <RepoReadme
                owner={pkg.config.owner}
                repo={this.state.repo}
                {...this.props.match.params}
              />
            </TabPane>
            <TabPane tab="最近活动" key="events">
              <RepoEvents
                owner={pkg.config.owner}
                repo={this.state.repo}
                {...this.props.match.params}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default Repo;
