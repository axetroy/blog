/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Menu, Row, Col, Popover } from 'antd';
import { NavLink } from 'react-router-dom';
import enquire from 'enquire.js';
import Octicon from 'react-octicon';

class MobileHead extends Component {
  state = {
    menuVisible: false,
    menuMode: 'horizontal',
    nav: [
      {
        name: 'Home',
        title: '主页',
        href: '/'
      },
      {
        name: 'post',
        title: '博客文章',
        href: '/post'
      },
      {
        name: 'repo',
        title: '开源项目',
        href: '/repo'
      },
      {
        name: 'gist',
        title: 'Gist',
        href: '/gist'
      },
      {
        name: 'todo',
        title: 'Todo',
        href: '/todo'
      },
      {
        name: 'tool',
        title: '工具集',
        href: '/tool'
      },
      {
        name: 'github',
        title: 'Github',
        href: '/github'
      },
      {
        name: 'about',
        title: '关于我',
        href: '/about'
      }
    ]
  };
  componentDidMount() {
    enquire.register('only screen and (min-width: 0) and (max-width: 992px)', {
      match: () => {
        this.setState({
          menuMode: 'inline'
        });
      },
      unmatch: () => {
        this.setState({
          menuMode: 'horizontal'
        });
      }
    });
  }
  handleHideMenu = () => {
    this.setState({
      menuVisible: false
    });
  };
  onMenuVisibleChange = visible => {
    this.setState({
      menuVisible: visible
    });
  };
  render() {
    const { menuMode, menuVisible } = this.state;
    const menu = [
      <Menu
        key={'menu'}
        theme={menuMode === 'horizontal' ? 'dark' : ''}
        mode={menuMode}
        style={{
          border: 0,
          minWidth: '16rem'
        }}
      >
        {this.state.nav.map(nav => {
          return (
            <Menu.Item key={nav.name}>
              <NavLink
                onClick={() => this.handleHideMenu()}
                activeStyle={{
                  color: '#FF5722'
                }}
                to={nav.href}
              >
                {nav.title}
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    ];
    return (
      <header
        style={{
          backgroundColor: '#3F51B5'
        }}
      >
        <Row
          style={{
            fontSize: '100%'
          }}
        >
          <Col span={8} />
          <Col span={8} />
          <Col span={8}>
            <div
              style={{
                textAlign: 'right'
              }}
            >
              <Popover
                placement="bottomRight"
                content={menu}
                trigger="click"
                visible={menuVisible}
                arrowPointAtCenter
                onVisibleChange={this.onMenuVisibleChange}
              >
                <Octicon
                  name="three-bars"
                  style={{
                    color: '#fff',
                    verticalAlign: 'middle',
                    padding: '1rem 2rem'
                  }}
                  mega
                />
              </Popover>
            </div>
          </Col>
        </Row>
      </header>
    );
  }
}
export default MobileHead;
