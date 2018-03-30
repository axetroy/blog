/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import PropTypes from "proptypes";
import { Menu, Icon, Tooltip } from "antd";
import { NavLink, matchPath, withRouter } from "react-router-dom";
import Octicon from "react-octicon";
import Rythm from "rythm.js";
import Footer from "../footer";

import "./index.css";

const fontStyle = { fontSize: "inherit", marginRight: "0.2rem" };

const navList = [
  {
    path: "/",
    name: "home",
    title: "网站主页",
    icon: <Octicon name="home" mega style={fontStyle} />
  },
  {
    path: "/post",
    title: "博客文章",
    icon: <Octicon name="book" mega style={fontStyle} />
  },
  {
    path: "/repo",
    title: "开源项目",
    icon: <Octicon name="repo" mega style={fontStyle} />
  },
  {
    path: "/todo",
    title: "待办事项",
    icon: <Icon type="exception" style={fontStyle} />
  },
  {
    path: "/gist",
    title: "代码片段",
    icon: <Octicon name="gist" mega style={fontStyle} />
  },
  {
    path: "/case",
    title: "案例展示",
    icon: <Icon type="book" style={fontStyle} />
  },
  {
    path: "/github",
    title: "开源贡献",
    icon: <Octicon name="mark-github" mega style={fontStyle} />
  },
  {
    path: "/about",
    title: "关于我",
    icon: <Icon type="question-circle" style={fontStyle} />
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
                    pathname: nav.path,
                    search: ""
                  });
                }}
              >
                {nav.icon ? nav.icon : ""}
                {nav.title}
              </div>
            );
          })}
        </div>

        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

export { navList };
