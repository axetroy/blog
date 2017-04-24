/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu } from 'antd';
import { Route, Switch, NavLink } from 'react-router-dom';

import github from '../../lib/github';
import Gist from '../gist';
import * as gistsAction from '../../redux/gists';

class Gists extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 50,
      total: 0
    }
  };
  async componentDidMount() {
    await this.getGistList();
  }

  async getGistList() {
    let gists = [];
    try {
      const { data } = await github.get('/users/axetroy/gists');
      gists = gists.concat(data || []);
    } catch (err) {
      console.error(err);
    }
    this.props.setGists(gists);
    return gists;
  }

  render() {
    const { pathname } = this.props.location;

    const matcher = pathname.match(/\/gist\/([^\/]+)/);

    const gistId = matcher ? matcher[1] : null;

    return (
      <Row className={'h100'}>
        <Col
          xl={4}
          lg={6}
          md={8}
          sm={8}
          xs={!gistId ? 24 : 0}
          className={'h100'}
        >
          <Menu
            mode="inline"
            className={'h100'}
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
          >
            {this.props.GISTS.map(gist => {
              return (
                <Menu.Item
                  key={gist.id}
                  className={gistId === gist.id ? 'ant-menu-item-selected' : ''}
                >
                  <NavLink
                    exact={true}
                    to={`/gist/${gist.id}`}
                    style={{
                      whiteSpace: 'nowrap',
                      wordBreak: 'break-all',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >
                    {gist.description}
                  </NavLink>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
        <Col
          xl={20}
          lg={18}
          md={16}
          sm={16}
          xs={gistId ? 24 : 0}
          className={'h100'}
          style={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Switch>
            <Route exact path="/gist/:id" component={Gist} />
          </Switch>
        </Col>
      </Row>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { GISTS: state.GISTS };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setGists: gistsAction.set
      },
      dispatch
    );
  }
)(Gists);
