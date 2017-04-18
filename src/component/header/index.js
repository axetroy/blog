/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Menu, Row, Col, Popover, Icon } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import enquire from 'enquire.js';
import Octicon from 'react-octicon';

class GlobalHead extends Component {
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
  handleShowMenu = () => {
    this.setState({
      menuVisible: true
    });
  };
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
          lineHeight: '6.4rem',
          borderRight: 0,
          minWidth: '20rem'
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
      <header>
        {menuMode === 'inline'
          ? <div
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
                    verticalAlign: 'middle'
                  }}
                  mega
                />
              </Popover>
            </div>
          : null}
        <Row>
          <Col lg={4} md={5} sm={24} xs={24}>
            <div
              className="logo"
              style={{
                opacity: 0
              }}
            />
          </Col>
          <Col lg={20} md={19} sm={0} xs={0}>
            {menuMode === 'horizontal' ? menu : null}
          </Col>
        </Row>
      </header>
    );
  }
}
export default GlobalHead;
