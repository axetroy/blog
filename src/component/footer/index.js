/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import moment from 'moment';

class Footer extends Component {
  state = {
    created: moment(new Date('2016-11-09 14:22:33')),
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
    let seconds = moment().diff(this.state.created, 'seconds');
    const days = Math.floor(seconds / (3600 * 24));
    seconds = seconds - days * 3600 * 24;

    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    this.setState({
      date: new Date(),
      days,
      hours,
      minutes,
      seconds
    });
  }

  render() {
    return (
      <Row className="text-center">
        <Col md={8} sm={12} xs={0}>
          <h3><Icon type="github" />Github</h3>
          <div>
            <a target="_blank" href="https://github.com/axetroy/blog">仓库源码</a>
          </div>
        </Col>
        <Col md={8} sm={12} xs={0}>
          <h3><Icon type="link" />相关技术</h3>
          <div>
            <a target="_blank" href="https://facebook.github.io/react/">
              React
            </a>
          </div>
          <div>
            <a target="_blank" href="https://github.com/reactjs/redux">Redux</a>
          </div>
          <div><a target="_blank" href="https://ant.design">Antd</a></div>
        </Col>
        <Col md={8} sm={0} xs={24}>
          <p>Copyright © 2017</p>
          <p>
            {`博客已运行 ${this.state.days}d ${this.state.hours}h ${this.state.minutes}m ${this.state.seconds}s`}
          </p>
          <p>
            created by
            {' '}
            <a target="_blank" href="https://github.com/axetroy">Axetroy</a>
          </p>
        </Col>
      </Row>
    );
  }
}
export default Footer;
