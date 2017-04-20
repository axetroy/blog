/**
 * Created by axetroy on 2017/4/21.
 */

import React, { Component } from 'react';
import { Row, Col, Icon, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
class Category extends Component {
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
        <Menu
          key={'menu'}
          style={{
            border: 0,
            minWidth: '20rem'
          }}
        >
          {this.state.nav.map(nav => {
            return (
              <Menu.Item key={nav.name} style={{ height: '5.4rem' }}>
                <NavLink
                  style={{ lineHeight: '5.4rem' }}
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
      </div>
    );
  }
}
export default Category;
