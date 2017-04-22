/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu, Pagination, Spin } from 'antd';
import { Route, Switch, NavLink } from 'react-router-dom';

import Todo from '../todo';

import github from '../../lib/github';
import pkg from '../../../package.json';
import * as todosAction from '../../redux/todos';

class TodoList extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 50,
      total: 0
    }
  };

  componentWillMount() {
    const { page, per_page } = this.state.meta;
    this.getTodoList(page, per_page);
  }

  async getTodoList(page, per_page) {
    let todoList = [];
    try {
      const {
        data
      } = await github.get(
        `/repos/${pkg.config.owner}/${pkg.config.todo_repo}/issues`,
        {
          params: { creator: pkg.config.owner, page, per_page }
        }
      );
      todoList = data;
      this.props.setTodo(todoList);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { pathname } = this.props.location;

    const matcher = pathname.match(/\/todo\/(\d+)/);

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
              {this.props.TODOS.map((todo, i) => {
                return (
                  <Menu.Item
                    key={todo.number + '/' + i}
                    className={
                      +number === +todo.number ? 'ant-menu-item-selected' : ``
                    }
                  >
                    <NavLink
                      exact={true}
                      to={`/todo/${todo.number}`}
                      title={todo.title}
                      style={{
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {todo.title}
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
              <Route path="/todo/:number" component={Todo} />
            </Switch>
          </Col>

        </Row>
      </Spin>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { TODOS: state.TODOS };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setTodo: todosAction.set
      },
      dispatch
    );
  }
)(TodoList);
