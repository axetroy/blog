import React, { Component } from "react";
import { HashRouter as Router, Route, Switch, NavLink } from "react-router-dom";
import { Provider } from "redux-zero/react";
import { Row, Col } from "antd";

import Footer from "./component/footer";
import ClickMaterial from "./component/click-material";
import DynamicLoad from "./component/dynamic-load";
import RouterListener from "./lib/router-listener";
import store from "./redux/store";

import "./App.css";

const ClickMaterialWithStatRouterListener = RouterListener(ClickMaterial);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ClickMaterialWithStatRouterListener
            style={{ overflow: "hidden" }}
            onRouterChange={(location, action) => {
              // location is an object like window.location
              window.ga("set", {
                page: location.pathname,
                title: document.title
              });
              window.scrollTo(0, 0);
            }}
          >
            <div id="nav">
              <NavLink to="/">
                <div id="nav-logo" />
              </NavLink>
            </div>
            <div id="content">
              <Row gutter={36}>
                <Col
                  id="left"
                  sm={{ span: 15, offset: 1 }}
                  xxl={{ span: 13, offset: 3 }}
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
                  </Switch>
                </Col>
                <Col id="right" sm={{ span: 7 }} xxl={{ span: 5 }}>
                  <DynamicLoad promise={import("./widget/about")} />
                  <DynamicLoad promise={import("./widget/stat")} />
                  <DynamicLoad promise={import("./widget/todo")} />
                  <DynamicLoad promise={import("./widget/gist")} />
                  {/* <DynamicLoad promise={import("./widget/showcase")} /> */}
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
