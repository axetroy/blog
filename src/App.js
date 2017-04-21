import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  HashRouter
} from 'react-router-dom';
import { Provider } from 'react-redux';

import { Layout, Row, Col } from 'antd';

const { Header, Content, Footer } = Layout;

import Home from './pages/home';
import Github from './pages/github';
import About from './pages/about';
import Posts from './pages/posts';
import Repos from './pages/repos';
import Repo from './pages/repo';
import Tool from './pages/tool';

import GlobalFooter from './component/footer';
import GlobalHeader from './component/header';
import Side from './component/side';
import Category from './component/category';
import ContentBody from './component/content';

import store from './redux/index';

import pkg from '../package.json';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={HashRouter}>
          <Row className={'h100'}>
            <Col span={3} className={'h100'}>
              <Side />
            </Col>
            <Col
              span={21}
              className={'h100'}
              style={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/github" component={Github} />
                <Route exact path="/about" component={About} />
                <Route path="/tool" component={Tool} />
                <Route path="/post" component={Posts} />
                <Route path="/repo" component={Repos} />
              </Switch>
            </Col>
          </Row>
        </Router>
      </Provider>
    );
  }
}

export default App;
