import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  HashRouter
} from 'react-router-dom';
import { Provider } from 'react-redux';

import { Row, Col } from 'antd';

import Home from './pages/home';
import Github from './pages/github';
import About from './pages/about';
import Posts from './pages/posts';
import Repos from './pages/repos';
import Tool from './pages/tool';
import Side from './component/side';
import store from './redux/index';

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
