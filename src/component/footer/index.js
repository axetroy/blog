/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import moment from 'moment';

class Footer extends Component {
  state = {
    createdDate: new Date('2016-11-09')
  };

  render() {
    return (
      <Row className="text-center">
        <Col md={8} xs={0}>
          <h3><Icon type="github" />Github</h3>
          <div>
            <a target="_blank" href="https://github.com/axetroy/blog">仓库源码</a>
          </div>
        </Col>
        <Col md={8} xs={0}>
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
        <Col md={8} xs={24}>
          <p>Copyright © 2017</p>
          <p>
            Created at
            {' '}
            {moment(this.state.createdDate).fromNow()}
            {' '}
            by
            {' '}
            <a target="_blank" href="https://github.com/axetroy">Axetroy</a>
          </p>
        </Col>
      </Row>
    );
  }
}
export default Footer;
