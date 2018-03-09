/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import PropTypes from "proptypes";
import { Menu, Icon, Tooltip } from "antd";
import { NavLink, matchPath, withRouter } from "react-router-dom";
import Octicon from "react-octicon";
import Rythm from "rythm.js";

import "./index.css";

const navList = [
  { path: "/", name: "home", title: "Home", icon: <Icon type="home" /> },
  {
    path: "/post",
    title: "博客文章",
    icon: <Octicon name="book" mega />
  },
  {
    path: "/repo",
    title: "开源项目",
    icon: <Octicon name="repo" mega />
  },
  {
    path: "/todo",
    title: "TODO",
    icon: <Icon type="exception" />
  },
  {
    path: "/gist",
    title: "Gist",
    icon: <Octicon name="gist" mega />
  },
  {
    path: "/github",
    title: "Github",
    icon: <Octicon name="gist" mega />
  },
  {
    path: "/about",
    title: "关于我",
    icon: <Icon type="question-circle" />
  }
].filter(v => v);

class Header extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      nav: navList
    };
  }
  componentDidMount() {}

  render() {
    const pathname = this.props.location.pathname;
    const navClassName = "ant-menu-item-selected";
    return (
      <div style={{ position: "fixed", width: "inherit" }}>
        <div
          style={{
            top: 0,
            left: 0,
            textAlign: "center",
            color: "#fff",
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: "#9E9E9E"
          }}
        >
          <div
            style={{
              padding: "3rem"
            }}
          >
            <img
              style={{
                width: "10rem",
                borderRadius: "50%"
              }}
              src="https://avatars1.githubusercontent.com/u/9758711?v=3"
              alt=""
            />
            <h2>
              <span style={{ color: "#fff" }}>Axetroy</span>
            </h2>
            <q>有些事现在不做 一辈子都不会做了</q>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem"
            }}
          >
            <Icon
              type="search"
              style={{
                fontSize: "3rem",
                color: "#fff",
                cursor: "pointer",
                border: "1px solid #64ceaa",
                borderRadius: "50%",
                backgroundColor: "#64ceaa",
                padding: "0.5rem"
              }}
              onClick={() => {
                this.props.history.push({
                  ...this.props.location,
                  pathname: "/search"
                });
              }}
            />
          </div>
        </div>

        <div style={{ clear: "both" }}>
          {this.state.nav.map(nav => {
            return (
              <div
                key={nav.path}
                className={
                  (() => {
                    const navPath = nav.path;
                    const isMatchRoute = matchPath(pathname, {
                      path: navPath
                    });
                    if (pathname === "/") {
                      return pathname === navPath ? navClassName : "";
                    } else {
                      return isMatchRoute && navPath !== "/"
                        ? navClassName
                        : "";
                    }
                  })() + " nav-item"
                }
                onClick={() => {
                  this.props.history.push({
                    ...this.props.location,
                    pathname: nav.path
                  });
                }}
              >
                {nav.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

export { navList };
