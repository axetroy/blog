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

import store from './redux/index';

import pkg from '../package.json';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={HashRouter}>
          <Layout>
            <Row>
              <Col md={24} sm={0} xs={0}>
                <a
                  target="_blank"
                  href={`https://github.com/${pkg.config.owner}/${pkg.config.repo}`}
                >
                  <img
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      border: 0,
                      zIndex: 9999
                    }}
                    src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67"
                    alt="Fork me on GitHub"
                    data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"
                  />
                </a>
              </Col>
            </Row>
            <Header>
              <GlobalHeader />
            </Header>
            <Layout>
              <Layout>
                <Content
                  style={{
                    background: '#fff',
                    minHeight: '28rem'
                  }}
                >
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/github" component={Github} />
                    <Route exact path="/about" component={About} />
                    <Route path="/post" component={Posts} />
                    <Route path="/tool" component={Tool} />
                    <Route exact path="/repo" component={Repos} />
                    <Route path="/repo/:owner/:repo" component={Repo} />
                  </Switch>

                </Content>
                <Footer>
                  <GlobalFooter />
                </Footer>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
