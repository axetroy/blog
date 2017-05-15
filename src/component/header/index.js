/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component, PropTypes } from 'react';
import { Menu, Icon, Tooltip } from 'antd';
import { NavLink, matchPath, withRouter } from 'react-router-dom';
import Octicon from 'react-octicon';
import Rythm from 'rythm.js';

import './index.css';

class Header extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
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
    this.setState({ rythm });
  }

  playMusic() {
    const { rythm } = this.state;
    if (rythm) {
      if (!this.__bgmLoaded) {
        rythm.setMusic('./audio/bgm.mp3');
        rythm.addRythm('pulse2', 'pulse', 0, 10, {
          min: 0.1,
          max: 1.5
        });
        this.__bgmLoaded = true;
      }
      rythm.start();
      this.setState({ rythmState: 'play' });
    }
  }

  pauseMusic() {
    const { rythm } = this.state;
    if (rythm) {
      rythm.stop();
      this.setState({ rythmState: 'stop' });
    }
  }

  render() {
    const pathname = this.props.location.pathname;
    const navClassName = 'ant-menu-item-selected';
    return (
      <div
        id="header"
        style={{
          position: 'relative'
        }}
      >
        <div
          className="blur"
          style={{
            width: '100%',
            height: '20rem',
            backgroundImage: 'url(./img/header-img.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'inherit',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            textAlign: 'center',
            color: '#fff',
            width: '100%',
            height: '100%'
          }}
        >
          <div
            style={{
              marginTop: '3rem'
            }}
          >
            <img
              style={{
                width: '10rem',
                borderRadius: '50%'
              }}
              src="https://avatars1.githubusercontent.com/u/9758711?v=3"
              alt=""
            />
            <h2>
              Axetroy's NeverLand
              <Tooltip
                placement="right"
                title={
                  this.state.rythmState === 'stop' ? 'Play Music' : 'Pause'
                }
              >
                <div
                  className="pulse2"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: this.state.rythmState === 'stop'
                      ? '#F44336'
                      : '#4CAF50',
                    borderRadius: '50%',
                    cursor: 'point',
                    display: 'inline-block',
                    marginLeft: '0.6rem',
                    verticalAlign: 'middle'
                  }}
                  onClick={() => {
                    if (this.state.rythmState === 'stop') {
                      this.playMusic();
                    } else {
                      this.pauseMusic();
                    }
                  }}
                />
              </Tooltip>
            </h2>
            <q>有些事现在不做 一辈子都不会做了</q>
          </div>
          <div
            style={{
              float: 'right',
              marginRight: '2rem'
            }}
          >
            <Icon
              type="search"
              style={{
                fontSize: '3rem',
                color: '#fff',
                cursor: 'pointer',
                border: '1px solid #64ceaa',
                borderRadius: '50%',
                backgroundColor: '#64ceaa',
                padding: '0.5rem'
              }}
              onClick={() => {
                this.props.history.push({
                  ...this.props.location,
                  pathname: '/search'
                });
              }}
            />
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
      </div>
    );
  }
}
export default withRouter(Header);
