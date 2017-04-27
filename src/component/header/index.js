/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { NavLink, matchPath } from 'react-router-dom';
import Octicon from 'react-octicon';
import Rythm from 'rythm.js';

class Header extends Component {
  state = {
    rythmState: 'stop',
    nav: [
      { path: '/', name: 'home', title: 'Home', icon: <Icon type="home" /> },
      {
        path: '/post',
        title: '博客文章',
        icon: <Octicon name="book" mega />
      },
      {
        path: '/repo',
        title: '开源项目',
        icon: <Octicon name="repo" mega />
      },
      {
        path: '/todo',
        title: 'TODO',
        icon: <Icon type="exception" />
      },
      {
        path: '/gist',
        title: 'Gist',
        icon: <Octicon name="gist" mega />
      },
      {
        path: '/github',
        title: 'Github',
        icon: <Octicon name="mark-github" mega />
      },
      {
        path: '/about',
        title: '关于我',
        icon: <Icon type="question-circle" />
      }
    ]
  };

  componentDidMount() {
    const rythm = new Rythm();
    rythm.setMusic('./audio/bgm.mp3');

    rythm.addRythm('pulse2', 'pulse', 0, 10, {
      min: 0.1,
      max: 1.5
    });

    rythm.start();
    this.setState({ rythm, rythmState: 'play' });
  }

  render() {
    const pathname = (location.pathname + location.hash).replace('/#/', '/');
    const navClassName = 'ant-menu-item-selected';
    return (
      <div id="header" style={{ position: 'relative' }}>
        <div
          style={{
            width: '100%',
            height: '20rem',
            backgroundImage: 'url(./img/header-image.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'inherit',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              color: '#607D8B'
            }}
          >
            <h2>Axetroy's NeverLand</h2>
            <q>生活已经如此的艰难, 有些事情就不要拆穿...</q>
          </div>
        </div>
        <Menu mode="horizontal">
          {this.state.nav.map(nav => {
            return (
              <Menu.Item
                key={nav.path}
                className={(() => {
                  const navPath = nav.path;
                  const isMatchRoute = matchPath(pathname, {
                    path: navPath
                  });
                  if (pathname === '/') {
                    return pathname === navPath ? navClassName : '';
                  } else {
                    return isMatchRoute && navPath !== '/' ? navClassName : '';
                  }
                })()}
              >
                <NavLink
                  to={nav.path}
                  style={{
                    fontSize: '1.4rem'
                  }}
                >
                  {nav.icon ? nav.icon : ''}{nav.title}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
        <div
          className="pulse2"
          style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: this.state.rythmState === 'stop'
              ? '#F44336'
              : '#4CAF50',
            borderRadius: '50%',
            position: 'absolute',
            right: '1.1rem',
            bottom: '1.1rem',
            cursor: 'point'
          }}
          onClick={() => {
            if (this.state.rythmState === 'stop') {
              this.state.rythm.start();
              this.setState({ rythmState: 'play' });
            } else {
              this.state.rythm.stop();
              this.setState({ rythmState: 'stop' });
            }
          }}
        />
      </div>
    );
  }
}
export default Header;
