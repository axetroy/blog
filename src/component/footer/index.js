/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { diffTime } from '../../lib/utils';

class Footer extends Component {
  state = {
    created: new Date('2016-11-09 14:22:33'),
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  componentDidMount() {
    const intervalId = setInterval(this.timer.bind(this), 1000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    const diff = diffTime(new Date('2016-11-09 14:22:33'))(new Date());
    this.setState({
      date: new Date(),
      ...diff
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
          <p>Copyright © 2017</p>
          <p>
            {`已运行 ${this.state.days}天 ${this.state.hours}时 ${this.state.minutes}分 ${this.state.seconds}秒`}
          </p>
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
