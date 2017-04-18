/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Tag, Spin } from 'antd';
import sortBy from 'lodash.sortby';

import GithubColors from '../../lib/github-colors.json';
import Chart from '../../component/chart';

function values(obj) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]]);
    }
  }
  return result;
}

class GithubLang extends Component {
  state = { lang: {}, init: false };

  componentWillReceiveProps(nextPros) {
    if (this.props.ALL_REPOS) {
      this.stat(nextPros.ALL_REPOS);
    }
  }

  /**
   * 统计编程语言
   * @param repos
   */ stat(repos = []) {
    let lang = {};
    repos = [].concat(repos);
    while (repos.length) {
      const repo = repos.shift();
      const { language } = repo;
      if (!language) {
      } else if (lang[language] === void 0) {
        lang[language] = 1;
      } else {
        lang[language] = lang[language] + 1;
      }
    }
    this.setState({
      lang: {
        ...this.state.lang,
        ...lang
      },
      init: true
    });
  }
  render() {
    // TODO： 通过/repos/:owner/:repo/languages获取准确的语言相关
    const languages = Object.keys(this.state.lang);
    const starPercent = values(this.state.lang).map(v =>
      (v / this.props.ALL_REPOS.length).toFixed(1)
    );
    const startNum = sortBy(values(this.state.lang), v => -v);
    return (
      <Spin spinning={!this.state.init}>
        <Row>
          <Col md={12} xs={24}>
            <Chart
              type="radar"
              data={{
                labels: languages,
                datasets: [
                  {
                    label: '使用语言频次',
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
            />
          </Col>

          <Col md={12} xs={24}>
            <Chart
              type="polarArea"
              data={{
                labels: languages,
                datasets: [
                  {
                    label: '语言 & 获得star',
                    data: startNum,
                    backgroundColor: languages.map(
                      lang =>
                        (GithubColors[lang] ? GithubColors[lang].color : '')
                    )
                  }
                ]
              }}
              options={{
                title: '语言 & 获得star',
                scale: {
                  lineArc: true
                }
              }}
            />
          </Col>
        </Row>
        <Row style={{ margin: '2rem 0' }}>
          <Col span={24}>
            {languages.map(lang => {
              return (
                <Tag
                  key={lang}
                  color={GithubColors[lang] ? GithubColors[lang].color : ''}
                >
                  {lang}
                </Tag>
              );
            })}
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
    return bindActionCreators({}, dispatch);
  }
)(GithubLang);
