/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Now from '@axetroy/react-now';
import { lazyload } from 'react-lazyload';

import moment from 'moment';

import { diffTime } from '../../lib/utils';
import firebase from '../../lib/firebase';

@lazyload({
  height: 200,
  offset: 100,
  once: true,
})
class Footer extends Component {
  state = {
    totalVisited: 0,
    created: new Date('2016-11-09 14:22:33'),
  };

  componentDidMount() {
    const visited = firebase.database().ref('statistics/visited/total');
    visited.once('value', data => {
      let value = data.val();
      this.setState({ totalVisited: value });
    });
  }

  render() {
    const LAST_UPDATE_TIME = new Date(+process.env.REACT_APP_PUBLISH_DATE);
    return (
      <Row
        className="text-center"
        style={{
          marginTop: '2rem',
          padding: '2rem 0',
          backgroundColor: '#fff',
        }}
      >
        <Col span={24}>
          {this.state.totalVisited ? (
            <p>总访问{this.state.totalVisited}次</p>
          ) : (
            ''
          )}
          <p>Copyright © 2017</p>
          <Now>
            {now => {
              const diff = diffTime(this.state.created)(now);
              return (
                <div>
                  <p>
                    {`已运行
                  ${diff.days}天
                  ${diff.hours}时
                  ${diff.minutes}分
                  ${diff.seconds}秒
                  `}
                  </p>
                  <p>
                    最近更新&nbsp;
                    {moment(LAST_UPDATE_TIME).fromNow()}
                  </p>
                </div>
              );
            }}
          </Now>
          <p>
            Created by{' '}
            <a target="_blank" href="https://github.com/axetroy">
              Axetroy
            </a>
          </p>
          <p>
            <a
              href="https://console.firebase.google.com/project/blog-9281a/database/data"
              target="_blank"
              rel="nofollow"
            >
              Firebase
            </a>
            &nbsp;&nbsp;
            <a
              href="https://analytics.google.com/analytics/web/?hl=zh-CN&pli=1#report/defaultid/a98287100w144548599p149233935/"
              target="_blank"
              rel="nofollow"
            >
              站长统计
            </a>
          </p>
        </Col>
      </Row>
    );
  }
}
export default Footer;
