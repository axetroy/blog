/**
 * Created by axetroy on 2017/4/21.
 */

import React, { Component } from 'react';
import { Menu, Button, Icon } from 'antd';
import { NavLink, matchPath } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import github from '../../lib/github';
import * as userAction from '../../redux/user';
import * as oauthAction from '../../redux/oauth';

class Side extends Component {
  state = {
    created: moment(new Date('2016-11-09 14:22:33')),
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
  async componentDidMount() {
    const intervalId = setInterval(this.timer.bind(this), 1000);
    this.setState({
      intervalId
    });
    await this.login();
  }
  async login() {
    const { access_token } = this.props.OAUTH;
    if (access_token) {
      let user = {};
      try {
        const { data } = await github.get('/user', {
          params: {
            access_token: access_token
          }
        });
        user = data;
      } catch (err) {
        console.error(err);
      } finally {
        this.props.login(user);
      }
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }
  componentWillReceiveProps(nextProd) {
    console.log('next prod', nextProd);
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
    const pathname = (location.pathname + location.hash).replace('/#/', '/');
    const navClassName = 'ant-menu-item-selected';
    return (
      <div
        className={'h100'}
        style={{
          textAlign: 'center',
          borderRight: '1px solid rgb(233, 233, 233)'
        }}
      >
        <div>
          <img
            src="https://avatars1.githubusercontent.com/u/9758711?v=3"
            alt=""
            style={{
              maxWidth: '100%',
              width: '12rem',
              height: 'auto',
              borderRadius: '50%',
              verticalAlign: 'middle',
              margin: '2rem 0',
              border: '0.5rem solid #009688'
            }}
          />
        </div>
        <div>
          <h3>Axetroy</h3>
        </div>
        <div>
          {this.props.USER && this.props.USER.name
            ? <div>
                <p>Welcome {this.props.USER.name}</p>
                <Button
                  onClick={() => {
                    this.props.logout();
                    this.props.cleanOauth();
                  }}
                >
                  <Icon type="github" />Logout
                </Button>
              </div>
            : <div>
                <Button
                  onClick={() => {
                    const newWindow = window.open(
                      `https://github.com/login/oauth/authorize?client_id=b8257841dd7ca5eef2aa&redirect_uri=https://axetroy.github.io/#/oauth/`,
                      '_blank',
                      'width=600,height=400,menubar=no,toolbar=no,scrollbar=no,resize=no'
                    );
                    window.onoauth = function(data) {
                      console.log('access data', data);
                      newWindow.close();
                      location.reload();
                    };
                  }}
                >
                  <Icon type="github" />Login
                </Button>
              </div>}
        </div>
        <Menu
          mode="inline"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRight: 0
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
                <NavLink to={nav.href}>
                  {nav.title}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
        <div>
          <p>
            {`${this.state.days}d ${this.state.hours}h ${this.state.minutes}m ${this.state.seconds}s`}
          </p>
          <p>
            Created by
            {' '}
            <a target="_blank" href="https://github.com/axetroy">Axetroy</a>
          </p>
          <p>Copyright © 2017</p>
        </div>
      </div>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      OAUTH: state.OAUTH,
      USER: state.USER
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        login: userAction.login,
        logout: userAction.logout,
        cleanOauth: oauthAction.clean
      },
      dispatch
    );
  }
)(Side);
