import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  NavLink,
  matchPath
} from "react-router-dom";
import { Provider } from "redux-zero/react";
import { Row, Col, Menu, Icon } from "antd";

import Footer from "./component/footer";
import ClickMaterial from "./component/click-material";
import DynamicLoad from "./component/dynamic-load";
import RouterListener from "./lib/router-listener";
import store from "./redux/store";

import "./App.css";

const ClickMaterialWithStatRouterListener = RouterListener(ClickMaterial);

export default class App extends Component {
  state = {
    widthScreenMode: false,
    // 宽屏模式的路由
    widthScreenRouter: [
      "/todo",
      "/todo/:id",
      "/gist",
      "/gist/:id",
      "/stackoverflow",
      "/stackoverflow/:number"
    ],
    contentLayout: {
      xs: { span: 24, offset: 0 },
      sm: { span: 22, offset: 1 },
      md: { span: 22, offset: 1 },
      lg: { span: 15, offset: 1 },
      xl: { span: 14, offset: 2 },
      xxl: { span: 13, offset: 3 }
    },
    widgetLayout: {
      xs: { span: 24, offset: 0 },
      sm: { span: 22, offset: 1 },
      md: { span: 22, offset: 1 },
      lg: { span: 7, offset: 0 },
      xl: { span: 6, offset: 0 },
      xxl: { span: 5, offset: 0 }
    },
    widthContentLayout: {
      xs: { span: 24, offset: 0 },
      sm: { span: 22, offset: 1 },
      md: { span: 22, offset: 1 },
      lg: { span: 18, offset: 3 },
      xl: { span: 18, offset: 3 },
      xxl: { span: 16, offset: 4 }
    },
    widthWidgetLayout: {
      span: 0
    }
  };
  // 是否启用宽屏模式
  shouldEnableWidthScreen(path) {
    path = path || window.location.hash.replace(/^#/, "").split("?")[0];
    for (const p of this.state.widthScreenRouter) {
      const currentRoute = matchPath(path, {
        path: p,
        exact: false
      });

      if (currentRoute) {
        return true;
      }
    }
    return false;
  }
  componentWillMount() {
    const widthScreenMode = this.shouldEnableWidthScreen();
    this.setState({ widthScreenMode });
  }
  render() {
    const { widthScreenMode } = this.state;

    const path = window.location.hash.replace(/^#/, "").split("?")[0];

    const cate = path.split("/")[1] || "";

    return (
      <Provider store={store}>
        <Router>
          <ClickMaterialWithStatRouterListener
            style={{ overflow: "hidden" }}
            onRouterChange={(location, action) => {
              const widthScreenMode = this.shouldEnableWidthScreen(
                location.path
              );
              this.setState({ widthScreenMode });
              // location is an object like window.location
              window.ga("set", {
                page: location.pathname,
                title: document.title
              });
              window.scrollTo(0, 0);
            }}
          >
            <div id="nav">
              <Menu mode="horizontal" defaultSelectedKeys={["/" + cate]}>
                <Menu.Item key="/">
                  <NavLink to="/">
                    <Icon type="home" />
                    首页
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="/todo">
                  <NavLink to="/todo">
                    <Icon type="check-circle" />
                    待办事项
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="/gist">
                  <NavLink to="/gist">
                    <Icon type="book" />
                    代码片段
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="/stackoverflow">
                  <NavLink to="/stackoverflow">
                    <Icon type="book" />
                    踩过的坑
                  </NavLink>
                </Menu.Item>
              </Menu>
            </div>
            <div id="content">
              <Row gutter={36}>
                <Col
                  id="left"
                  {...(widthScreenMode
                    ? this.state.widthContentLayout
                    : this.state.contentLayout)}
                >
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <DynamicLoad promise={import("./pages/posts")} />
                      )}
                    />
                    <Route
                      exact
                      path="/post/:number"
                      render={() => (
                        <DynamicLoad promise={import("./pages/post")} />
                      )}
                    />
                    <Route
                      exact
                      path="/todo/:number"
                      render={() => (
                        <DynamicLoad promise={import("./pages/todo")} />
                      )}
                    />
                    <Route
                      exact
                      path="/todo"
                      render={() => (
                        <DynamicLoad promise={import("./pages/todos")} />
                      )}
                    />
                    <Route
                      exact
                      path="/gist/:id"
                      render={() => (
                        <DynamicLoad promise={import("./pages/gist")} />
                      )}
                    />
                    <Route
                      exact
                      path="/gist"
                      render={() => (
                        <DynamicLoad promise={import("./pages/gists")} />
                      )}
                    />
                    <Route
                      exact
                      path="/stackoverflow"
                      render={() => (
                        <DynamicLoad
                          promise={import("./pages/stackoverflows")}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/stackoverflow/:number"
                      render={() => (
                        <DynamicLoad
                          promise={import("./pages/stackoverflow")}
                        />
                      )}
                    />
                  </Switch>
                </Col>
                <Col
                  id="right"
                  {...(widthScreenMode
                    ? this.state.widthWidgetLayout
                    : this.state.widgetLayout)}
                >
                  <DynamicLoad promise={import("./widget/about")} />
                  <DynamicLoad promise={import("./widget/stat")} />
                  <DynamicLoad promise={import("./widget/todo")} />
                  <DynamicLoad promise={import("./widget/gist")} />
                </Col>
              </Row>
            </div>
            <Footer />
          </ClickMaterialWithStatRouterListener>
        </Router>
      </Provider>
    );
  }
}
