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
  render() {
    const { pathname } = this.props.location;
    const matcher = pathname.match(/\/tool\/([^\/]+)/);
    const toolName = matcher ? matcher[1] : null;
    return (
      <Row className={'h100'}>
        <Col sm={4} xs={!toolName ? 24 : 0} className={'h100'}>
          <Menu
            mode="inline"
            className={'h100'}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
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

        <Col
          sm={20}
          xs={toolName ? 24 : 0}
          className={'h100'}
          style={{
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
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
