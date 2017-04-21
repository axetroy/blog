/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col, Menu } from 'antd';
import { Route, Switch, NavLink } from 'react-router-dom';

import Roll from '../../component/tool-roll';
import MdPreview from '../../component/tool-md-preview';

class Tool extends Component {
  state = {
    tools: [
      { title: 'Roll', name: 'roll' },
      {
        title: 'Markdown预览',
        name: 'md-preview'
      },
      {
        title: '加密解密',
        name: 'encryption'
      }
    ]
  };
  componentWillMount() {}
  render() {
    return (
      <Row>
        <Col span={4}>
          <Menu mode="inline">
            {this.state.tools.map((post, index) => {
              return (
                <Menu.Item key={index}>
                  <NavLink
                    exact={true}
                    activeClassName={'ant-menu-item-selected'}
                    to={`/tool/${post.name}`}
                  >
                    {post.title}
                  </NavLink>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>

        <Col span={20}>
          <div
            style={{
              padding: '2.4rem'
            }}
          >
            <Switch>
              <Route path="/tool/roll" component={Roll} />
              <Route path="/tool/md-preview" component={MdPreview} />
            </Switch>
          </div>
        </Col>

      </Row>
    );
  }
}
export default Tool;
