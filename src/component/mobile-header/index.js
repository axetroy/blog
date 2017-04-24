/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Menu, Row, Col, Popover, Icon } from 'antd';
import { NavLink, matchPath } from 'react-router-dom';
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
        name: 'tool',
        title: '工具集',
        href: '/tool'
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
    const pathname = (location.pathname + location.hash).replace('/#/', '/');
    const { menuMode, menuVisible } = this.state;
    const navClassName = 'ant-menu-item-selected';
    const menu = [
      <Menu
        key={'menu'}
        mode={menuMode}
        style={{
          border: 0,
          minWidth: '16rem'
        }}
      >
        {this.state.nav.map(nav => {
          return (
            <Menu.Item
              key={nav.name}
              className={(() => {
                const isMatchRoute = matchPath(pathname, { path: nav.href });
                if (pathname === '/') {
                  return pathname === nav.href ? navClassName : '';
                } else {
                  return isMatchRoute && nav.href !== '/' ? navClassName : '';
                }
              })()}
            >
              <NavLink onClick={() => this.handleHideMenu()} to={nav.href}>
                {nav.title}
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    ];
    const isHomePage = pathname === '/';
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
          <Col span={8}>
            {!isHomePage && history.length > 1
              ? <div className="text-left">
                  <span>
                    <Icon
                      type="rollback"
                      style={{
                        color: '#fff',
                        verticalAlign: 'middle',
                        padding: '1rem 2rem',
                        fontSize: '3.2rem'
                      }}
                      onClick={() => history.go(-1)}
                    />
                  </span>
                </div>
              : ''}
          </Col>
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
