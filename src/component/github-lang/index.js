/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Tag, Spin } from 'antd';
import sortBy from 'lodash.sortby';
import Octicon from 'react-octicon';
import { lazyload } from 'react-lazyload';

import GithubColors from '../../lib/github-colors.json';

import github from '../../lib/github';

import * as allRepoLanguages from '../../redux/all-repo-languages';
import * as repoLanguages from '../../redux/repo-languages';

function values(obj) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]]);
    }
  }
  return result;
}

function sum(array) {
  let result = 0;
  for (let key in array) {
    if (array.hasOwnProperty(key)) {
      result = result + (array[key] || 0);
    }
  }
  return result;
}

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class GithubLang extends Component {
  state = { ALL_REPOS: null };

  componentWillMount() {
    import('@axetroy/react-chart.js').then(module => {
      this.setState({ ReactChart: module.default });
    });
  }

  componentWillReceiveProps(nextPros) {
    if (nextPros.ALL_REPOS && this.state.ALL_REPOS !== this.props.ALL_REPOS) {
      this.setState({ ALL_REPOS: nextPros.ALL_REPOS });
      this.stat(nextPros.ALL_REPOS);
    }
  }

  /**
   * 统计编程语言
   * @param repos
   */ async stat(repos = []) {
    let lang = {};
    repos = [].concat(repos).filter(v => !v.fork);
    while (repos.length) {
      const repo = repos.shift();
      const { data } = await github.get(
        `/repos/${repo.owner.login}/${repo.name}/languages`
      );
      this.props.storeRepoLang({
        repo: repo.name,
        languages: data
      });
      for (let language in data) {
        if (data.hasOwnProperty(language)) {
          if (!lang[language]) lang[language] = 0;
          lang[language] = lang[language] + +data[language];
        }
      }
    }
    this.props.storeLang(lang);
  }
  render() {
    const { ReactChart } = this.state;
    const languages = Object.keys(this.props.ALL_REPO_LANGUAGES);
    const lines = values(this.props.ALL_REPO_LANGUAGES);
    const total = sum(lines);
    const starPercent = lines.map(v => Math.max(v / total, 0.01).toFixed(2));
    const startNum = sortBy(values(this.props.ALL_REPO_LANGUAGES), v => -v);
    return (
      <Spin spinning={lines.length === 0}>
        <Row>
          <Col span={24}>
            <div
              style={{
                width: '100%',
                height: '1rem',
                backgroundColor: '#6e6e6e',
                display: 'table'
              }}
            >
              {(() => {
                const entity = [];
                for (let lang in this.props.ALL_REPO_LANGUAGES) {
                  if (this.props.ALL_REPO_LANGUAGES.hasOwnProperty(lang)) {
                    entity.push({
                      lang,
                      percent: this.props.ALL_REPO_LANGUAGES[lang] / total
                    });
                  }
                }
                return sortBy(entity, v => -v.percent).map(v => {
                  return (
                    <span
                      key={v.lang}
                      title={`${v.lang}: ${(v.percent * 100).toFixed(2) + '%'}`}
                      style={{
                        display: 'table-cell',
                        width: v.percent * 100 + '%',
                        backgroundColor: (GithubColors[v.lang] || {}).color
                      }}
                    />
                  );
                });
              })()}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={24}>
            {ReactChart
              ? <ReactChart
                  type="radar"
                  data={{
                    labels: languages,
                    datasets: [
                      {
                        backgroundColor: 'rgba(179,181,198,0.2)',
                        borderColor: 'rgba(179,181,198,1)',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                        data: starPercent
                      }
                    ]
                  }}
                  options={{
                    animation: false,
                    title: {
                      display: true,
                      text: '使用语言频次'
                    },
                    legend: {
                      display: false
                    }
                  }}
                />
              : ''}
          </Col>

          <Col md={12} xs={24}>
            {ReactChart
              ? <ReactChart
                  type="polarArea"
                  data={{
                    labels: languages,
                    datasets: [
                      {
                        data: startNum,
                        backgroundColor: languages.map(
                          lang =>
                            GithubColors[lang] ? GithubColors[lang].color : ''
                        )
                      }
                    ]
                  }}
                  options={{
                    animation: false,
                    scale: {
                      lineArc: true
                    },
                    title: {
                      display: true,
                      text: '语言 & 代码量'
                    },
                    legend: {
                      display: true
                    }
                  }}
                />
              : ''}

          </Col>
        </Row>
        <Row
          style={{
            margin: '2rem 0'
          }}
        >
          <Col span={24}>
            {languages.map(lang => {
              return (
                <Tag
                  key={lang}
                  color={GithubColors[lang] ? GithubColors[lang].color : ''}
                  style={{
                    margin: '1rem 0.5rem'
                  }}
                  onClick={() =>
                    this.setState({
                      currentLang: lang
                    })}
                >
                  {lang}
                </Tag>
              );
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {(() => {
              // TODO: 语言相关不精准
              if (!this.state.currentLang) return '';
              let list = [];
              for (let repo in this.props.REPO_LANGUAGES) {
                if (this.props.REPO_LANGUAGES.hasOwnProperty(repo)) {
                  const languages = this.props.REPO_LANGUAGES[repo];
                  if (languages[this.state.currentLang]) {
                    list = list.concat([repo]);
                  }
                }
              }
              return sortBy(
                this.props.ALL_REPOS.filter(repo => list.includes(repo.name)),
                repo => -(repo.stargazers ? repo.stargazers.totalCount : 0)
              )
                .slice(0, 10)
                .map(repo => {
                  return (
                    <Row
                      key={repo.name}
                      style={{
                        margin: '1rem 0',
                        padding: '1rem 0'
                      }}
                    >
                      <Col span={20}>
                        <h3>
                          <a href={repo.url} target="_blank">
                            {repo.name}
                          </a>
                        </h3>
                        <p
                          style={{
                            color: '#c0c0c0'
                          }}
                        >
                          {repo.description}
                        </p>
                      </Col>
                      <Col span={4}>
                        <Octicon
                          style={{
                            fontSize: '2rem'
                          }}
                          name="star"
                          mega
                        />
                        {repo.stargazers ? repo.stargazers.totalCount : 0}
                      </Col>
                    </Row>
                  );
                });
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
      ALL_REPOS: state.ALL_REPOS,
      REPO_LANGUAGES: state.REPO_LANGUAGES,
      ALL_REPO_LANGUAGES: state.ALL_REPO_LANGUAGES
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeLang: allRepoLanguages.store,
        storeRepoLang: repoLanguages.push
      },
      dispatch
    );
  }
)(GithubLang);
