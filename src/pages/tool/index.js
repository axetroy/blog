/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col, Layout, Menu } from 'antd';
import { Route, Switch, NavLink } from 'react-router-dom';

const { Sider, Content } = Layout;

import Roll from '../../component/tool-roll';
import MdPreview from '../../component/tool-md-preview';

const styles = {
  content: {
    background: '#fff',
    padding: 24,
    margin: 0,
    minHeight: 280
  }
};

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
        <Col
          md={{
            span: 4,
            offset: 4
          }}
          xs={24}
        >
          <Menu
            mode="inline"
            style={{
              height: '100%',
              ...styles.content
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

        <Col md={12} xs={24}>
          <div style={styles.content}>
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
