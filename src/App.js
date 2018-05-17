import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  BrowserRouter,
  NavLink
} from "react-router-dom";
import { Provider } from "redux-zero/react";

import { Row, Col, Card, Icon, Menu, Popover } from "antd";

import Aside, { navList } from "./component/aside";
import ClickMaterial from "./component/click-material";
import DynamicLoad from "./component/dynamic-load";

import RouterListener from "./lib/router-listener";

import "./App.css";

import store from "./redux/store";

const ClickMaterialWithStatRouterListener = RouterListener(ClickMaterial);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={BrowserRouter}>
          <ClickMaterialWithStatRouterListener
            onRouterChange={(location, action) => {
              // location is an object like window.location
              window.ga("set", {
                page: location.pathname,
                title: document.title
              });
            }}
          >
            <Row>
              <Col xs={0} sm={0} md={6} style={{ position: "relative" }}>
                <Aside />
              </Col>
              <Col xs={24} sm={24} md={0}>
                <div
                  style={{ position: "relative", backgroundColor: "inherit" }}
                >
                  <div style={{ textAlign: "center", fontSize: "3rem" }}>
                    Axetroy
                  </div>

                  <Popover
                    placement="rightBottom"
                    content={
                      <Menu
                        style={{ border: 0 }}
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
                        mode="inline"
                        inlineCollapsed={false}
                      >
                        {navList.map(nav => {
                          return (
                            <Menu.Item key={nav.title}>
                              <NavLink
                                to={nav.path}
                                style={{
                                  fontSize: "1.4rem"
                                }}
                              >
                                {nav.icon ? nav.icon : <span />}
                                {nav.title}
                              </NavLink>
                            </Menu.Item>
                          );
                        })}
                      </Menu>
                    }
                    trigger="click"
                  >
                    <Icon
                      type="bars"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: "1rem",
                        fontSize: "4rem",
                        zIndex: "999",
                        lineHeight: "45px",
                        cursor: "pointer"
                      }}
                    />
                  </Popover>
                </div>
              </Col>
              <Col xs={24} sm={24} md={18}>
                <Card>
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <DynamicLoad promise={import("./pages/home")} />
                      )}
                    />
                    <Route
                      exact
                      path="/github"
                      render={() => (
                        <DynamicLoad promise={import("./pages/github")} />
                      )}
                    />
                    <Route
                      exact
                      path="/about"
                      render={() => (
                        <DynamicLoad promise={import("./pages/about")} />
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
                      path="/post"
                      render={() => (
                        <DynamicLoad promise={import("./pages/posts")} />
                      )}
                    />
                    <Route
                      exact
                      path="/repo/:repo"
                      render={() => (
                        <DynamicLoad promise={import("./pages/repo")} />
                      )}
                    />
                    <Route
                      exact
                      path="/repo"
                      render={() => (
                        <DynamicLoad promise={import("./pages/repos")} />
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
                      path="/search"
                      render={() => (
                        <DynamicLoad promise={import("./pages/search")} />
                      )}
                    />
                    <Route
                      exact
                      path="/case"
                      render={() => (
                        <DynamicLoad promise={import("./pages/case")} />
                      )}
                    />
                  </Switch>
                </Card>
              </Col>
            </Row>
          </ClickMaterialWithStatRouterListener>
        </Router>
      </Provider>
    );
  }
}
