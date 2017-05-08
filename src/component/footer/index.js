/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Now from '@axetroy/react-now';

import { diffTime } from '../../lib/utils';

class Footer extends Component {
  state = {
    created: new Date('2016-11-09 14:22:33')
  };

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
