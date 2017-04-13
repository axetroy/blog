/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link, NavLink } from 'react-router-dom';

class GlobalHead extends Component {
  state = {
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

  render() {
    return (
      <div>
        <div className="logo" style={{ opacity: 0 }} />
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '6.4rem' }}>
          {this.state.nav.map(nav => {
            return (
              <Menu.Item key={nav.name}>
                <NavLink activeStyle={{ color: '#FF5722' }} to={nav.href}>
                  {nav.title}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default GlobalHead;
