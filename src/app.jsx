import { Col, Icon, Menu, Row } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import {
  HashRouter as Router,
  matchPath,
  NavLink,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Provider } from "redux-zero/react";
import DynamicLoad from "./component/dynamic-load";
import Footer from "./component/footer";
import GoogleAnalytics from "./component/ga";
import Ripple from "./component/ripple";
import store from "./redux/store";
import "./app.css";

const widthScreenRouter = [
  "/todo",
  "/todo/:id",
  "/gist",
  "/gist/:id",
  "/stackoverflow",
  "/stackoverflow/:number"
];

const contentLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 15, offset: 1 },
  xl: { span: 14, offset: 2 },
  xxl: { span: 13, offset: 3 }
};

const widgetLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 7, offset: 0 },
  xl: { span: 6, offset: 0 },
  xxl: { span: 5, offset: 0 }
};

const widthContentLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 18, offset: 3 },
  xl: { span: 18, offset: 3 },
  xxl: { span: 16, offset: 4 }
};

const widthWidgetLayout = {
  span: 0
};

function Content() {
  const location = useLocation();
  const [widthScreenMode, setWidthScreenMode] = useState(false);

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === "/") {
      setWidthScreenMode(false);
      return;
    }
    for (const p of widthScreenRouter) {
      const currentRoute = matchPath(pathname, {
        path: p,
        exact: false
      });

      if (currentRoute) {
        setWidthScreenMode(true);
        return;
      }
    }

    setWidthScreenMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} timeout={800} classNames="fade">
        <Row gutter={36}>
          <Col
            id="left"
            {...(widthScreenMode ? widthContentLayout : contentLayout)}
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
                  <DynamicLoad import={() => import("./pages/stackoverflow")} />
                )}
              />
            </Switch>
          </Col>
          <Col
            id="right"
            {...(widthScreenMode ? widthWidgetLayout : widgetLayout)}
          >
            <Widget />
          </Col>
        </Row>
      </CSSTransition>
    </TransitionGroup>
  );
}

function Widget() {
  return (
    <Fragment>
      <DynamicLoad import={() => import("./widget/about")} />
      <DynamicLoad import={() => import("./widget/stat")} />
      <DynamicLoad import={() => import("./widget/todo")} />
      <DynamicLoad import={() => import("./widget/gist")} />
    </Fragment>
  );
}

function Nav() {
  const location = useLocation();
  return (
    <Menu mode="horizontal" defaultSelectedKeys={[location.pathname]}>
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

export default function App(props) {
  return (
    <Provider store={store} {...props}>
      <Router>
        <GoogleAnalytics />
        <Ripple>
          <div id="nav">
            <Nav />
          </div>
          <div id="content">
            <Content />
          </div>
          <Footer />
        </Ripple>
      </Router>
    </Provider>
  );
}
