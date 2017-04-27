import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  HashRouter,
  NavLink,
  matchPath
} from 'react-router-dom';
import { Provider } from 'react-redux';

import { Row, Col, Menu, Icon, Card } from 'antd';

import Home from './pages/home';
import Github from './pages/github';
import About from './pages/about';
import Posts from './pages/posts';
import Post from './pages/post';
import Repos from './pages/repos';
import Repo from './pages/repo';
import Tool from './pages/tool';
import Todos from './pages/todos';
import Todo from './pages/todo';
import Gists from './pages/gists';
import Gist from './pages/gist';
import OAuth from './pages/oauth';
import Side from './component/side';
import FullHeight from './component/full-height';
import MobileHeader from './component/mobile-header';
import Footer from './component/footer';
import Header from './component/header';
import store from './redux/index';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={HashRouter}>
          <Row>
            <Col
              lg={{ span: 12, offset: 6 }}
              md={{ span: 16, offset: 4 }}
              sm={{ span: 20, offset: 2 }}
              xs={{ span: 24 }}
            >
              <Header />

            </Col>
            <Col
              lg={{ span: 12, offset: 6 }}
              md={{ span: 16, offset: 4 }}
              sm={{ span: 20, offset: 2 }}
              xs={{ span: 24 }}
            >
              <Card
                style={{
                  marginTop: '2rem'
                }}
              >
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/github" component={Github} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/tool" component={Tool} />
                  <Route exact path="/post/:number" component={Post} />
                  <Route exact path="/post" component={Posts} />
                  <Route exact path="/repo/:repo" component={Repo} />
                  <Route exact path="/repo" component={Repos} />
                  <Route exact path="/todo/:number" component={Todo} />
                  <Route exact path="/todo" component={Todos} />
                  <Route exact path="/gist/:id" component={Gist} />
                  <Route exact path="/gist" component={Gists} />
                </Switch>
              </Card>
            </Col>
            <Col
              lg={{ span: 12, offset: 6 }}
              md={{ span: 16, offset: 4 }}
              sm={{ span: 20, offset: 2 }}
              xs={{ span: 24 }}
            >
              <Footer />
            </Col>
          </Row>
        </Router>
      </Provider>
    );
  }
}
export default App;
