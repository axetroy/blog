import { Col, Icon, Menu, Row } from "antd";
import React, { Component } from "react";
import {
  HashRouter as Router,
  matchPath,
  NavLink,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Provider } from "redux-zero/react";
import "./app.css";
import DynamicLoad from "./component/dynamic-load";
import Footer from "./component/footer";
import GoogleAnalytics from "./component/ga";
import ClickMaterial from "./component/ripple";
import store from "./redux/store";

class ContentWrap extends Component {
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
    path = path || this.props.location.pathname;
    if (path === "/") {
      return false;
    }
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
  updateMode(path) {
    const widthScreenMode = this.shouldEnableWidthScreen(path);
    this.setState({ widthScreenMode });
  }
  UNSAFE_componentWillReceiveProps(nextProp, prevProp) {
    this.updateMode(nextProp.location.pathname);
  }
  UNSAFE_componentWillMount() {
    this.updateMode();
  }
  render() {
    const { widthScreenMode } = this.state;
    const location = this.props.location;
    return (
      <TransitionGroup>
        <CSSTransition key={location.pathname} timeout={800} classNames="fade">
          <Row gutter={36}>
            <Col
              id="left"
              {...(widthScreenMode
                ? this.state.widthContentLayout
                : this.state.contentLayout)}
            >
              <Switch location={location}>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <DynamicLoad import={() => import("./pages/posts")} />
                  )}
                />
                <Route
                  exact
                  path="/post/:number"
                  render={() => (
                    <DynamicLoad import={() => import("./pages/post")} />
                  )}
                />
                <Route
                  exact
                  path="/todo/:number"
                  render={() => (
                    <DynamicLoad import={() => import("./pages/todo")} />
                  )}
                />
                <Route
                  exact
                  path="/todo"
                  render={() => (
                    <DynamicLoad import={() => import("./pages/todos")} />
                  )}
                />
                <Route
                  exact
                  path="/gist/:id"
                  render={() => (
                    <DynamicLoad import={() => import("./pages/gist")} />
                  )}
                />
                <Route
                  exact
                  path="/gist"
                  render={() => (
                    <DynamicLoad import={() => import("./pages/gists")} />
                  )}
                />
                <Route
                  exact
                  path="/stackoverflow"
                  render={() => (
                    <DynamicLoad
                      import={() => import("./pages/stackoverflows")}
                    />
                  )}
                />
                <Route
                  exact
                  path="/stackoverflow/:number"
                  render={() => (
                    <DynamicLoad
                      import={() => import("./pages/stackoverflow")}
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
              <DynamicLoad import={() => import("./widget/about")} />
              <DynamicLoad import={() => import("./widget/stat")} />
              <DynamicLoad import={() => import("./widget/todo")} />
              <DynamicLoad import={() => import("./widget/gist")} />
            </Col>
          </Row>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

class MenuWrap extends Component {
  render() {
    const pathname = this.props.location.pathname;
    return (
      <Menu mode="horizontal" defaultSelectedKeys={[pathname]}>
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
    );
  }
}

const Content = withRouter(ContentWrap);
const ContentMenu = withRouter(MenuWrap);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <GoogleAnalytics />
          <ClickMaterial
            style={{ overflow: "hidden" }}
            onRouterChange={(location, action) => {
              // @ts-ignore
              window.ga("set", {
                page: location.pathname,
                title: document.title
              });
              window.scrollTo(0, 0);
            }}
          >
            <div id="nav">
              <ContentMenu />
            </div>
            <div id="content">
              <Content />
            </div>
            <Footer />
          </ClickMaterial>
        </Router>
      </Provider>
    );
  }
}
