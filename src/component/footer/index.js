/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Now from '@axetroy/react-now';
import { lazyload } from 'react-lazyload';

import { diffTime } from '../../lib/utils';
import firebase from '../../lib/firebase';

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class Footer extends Component {
  state = {
    totalVisited: 0,
    created: new Date('2016-11-09 14:22:33')
  };

  componentDidMount() {
    const visited = firebase.database().ref('statistics/visited/total');
    visited.once('value', data => {
      let value = data.val();
      this.setState({ totalVisited: value });
    });
  }

  render() {
    return (
      <Row
        className="text-center"
        style={{
          marginTop: '2rem',
          padding: '2rem 0',
          backgroundColor: '#fff'
        }}
      >
        <Col span={24}>
          {this.state.totalVisited ? <p>总访问{this.state.totalVisited}次</p> : ''}
          <p>Copyright © 2017</p>
          <Now>
            {now => {
              const diff = diffTime(this.state.created)(now);
              return (
                <p>
                  {`已运行
                  ${diff.days}天
                  ${diff.hours}时
                  ${diff.minutes}分
                  ${diff.seconds}秒
                  `}
                </p>
              );
            }}
          </Now>
          <p>
            Created by
            {' '}
            <a target="_blank" href="https://github.com/axetroy">Axetroy</a>
          </p>
        </Col>
      </Row>
    );
  }
}
export default Footer;
