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
import Todos from './pages/todos';
import Gists from './pages/gists';
import OAuth from './pages/oauth';
import Side from './component/side';
import FullHeight from './component/full-height';
import MobileHeader from './component/mobile-header';
import Footer from './component/footer';
import store from './redux/index';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={HashRouter}>
          <FullHeight>
            <Row className={'h100'}>
              <Col sm={0} xs={24} style={{ transition: 'all 1s' }}>
                <MobileHeader {...this.props} />
              </Col>
              <Col
                sm={3}
                xs={0}
                className={'h100'}
                style={{ transition: 'all 1s' }}
              >
                <Side />
              </Col>
              <Col
                sm={21}
                xs={24}
                className={'h100'}
                style={{
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  transition: 'all 1s'
                }}
              >
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/github" component={Github} />
                  <Route exact path="/about" component={About} />
                  <Route path="/tool" component={Tool} />
                  <Route path="/post" component={Posts} />
                  <Route path="/repo" component={Repos} />
                  <Route path="/todo" component={Todos} />
                  <Route path="/gist" component={Gists} />
                  <Route path="/oauth" component={OAuth} />
                </Switch>
              </Col>
              <Col xs={24} sm={0} style={{ transition: 'all 1s' }}>
                <Footer {...this.props} />
              </Col>
            </Row>
          </FullHeight>
        </Router>
      </Provider>
    );
  }
}

export default App;
