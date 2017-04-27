/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu, Pagination, Spin, Tag } from 'antd';
import { NavLink } from 'react-router-dom';

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
          params: { creator: pkg.config.owner, page, per_page, state: 'all' }
        }
      );
      todoList = data;
      this.props.setTodo(todoList);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <Spin spinning={false}>
        <Menu
          mode="inline"
          className={'h100'}
          style={{ overflowY: 'auto', overflowX: 'hidden', borderRight: 0 }}
        >
          {this.props.TODOS.map((todo, i) => {
            return (
              <Menu.Item
                style={{
                  borderBottom: '1px solid #e6e6e6'
                }}
                key={todo.number + '/' + i}
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
                  <Tag color={todo.state === 'open' ? 'red' : 'green'}>
                    {todo.state === 'open' ? '未完成' : '已完成'}
                  </Tag>
                  {todo.title}
                </NavLink>
              </Menu.Item>
            );
          })}

          {this.state.meta.total > 0
            ? <Menu.Item>
                <Row className="text-center">
                  <Col
                    span={24}
                    style={{
                      transition: 'all 1s'
                    }}
                  >
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
      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      TODOS: state.TODOS
    };
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
