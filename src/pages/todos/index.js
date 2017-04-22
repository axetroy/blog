/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu, Pagination, Spin } from 'antd';
import { Route, Switch, NavLink } from 'react-router-dom';

import Todo from '../todo';

class TodoList extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 50,
      total: 0
    }
  };
  async getTodoList() {}

  render() {
    const { pathname } = this.props.location;

    const matcher = pathname.match(/\/post\/(\d+)/);

    const number = matcher ? matcher[1] : null;

    return (
      <Spin spinning={false}>
        <Row className={'h100'}>
          <Col sm={4} xs={!number ? 24 : 0} className={'h100'}>
            <Menu
              mode="inline"
              className={'h100'}
              style={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
              {(this.props.TODOS || []).map((post, i) => {
                return (
                  <Menu.Item
                    key={post.number + '/' + i}
                    className={
                      +number === +post.number ? 'ant-menu-item-selected' : ``
                    }
                  >
                    <NavLink
                      exact={true}
                      to={`/post/${post.number}`}
                      title={post.title}
                      style={{
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </NavLink>
                  </Menu.Item>
                );
              })}

              {this.state.meta.total > 0
                ? <Menu.Item>
                    <Row className="text-center">
                      <Col span={24}>
                        <Pagination
                          simple
                          onChange={page =>
                            this.changePage(page, this.state.meta.per_page)}
                          defaultCurrent={this.state.meta.page}
                          defaultPageSize={this.state.meta.per_page}
                          total={this.state.meta.total}
                        />
                      </Col>
                    </Row>
                  </Menu.Item>
                : ''}

            </Menu>
          </Col>

          <Col
            sm={20}
            xs={number ? 24 : 0}
            className={'h100'}
            style={{
              overflowY: 'auto'
            }}
          >
            <Switch>
              <Route path="/post/:number" component={Todo} />
            </Switch>
          </Col>

        </Row>
      </Spin>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
  }
)(TodoList);
