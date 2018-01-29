/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'redux-zero/react';
import { Row, Col, Menu, Pagination, Spin, Tag, Icon, Tooltip } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import moment from 'moment';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';
import github from '../../lib/github';
import CONFIG from '../../config.json';

import actions from '../../redux/actions';

import './index.css';

class TodoList extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 100,
      total: 0,
    },
    currentLabel: '',
    badge: {},
  };

  componentWillMount() {
    const { page, per_page } = this.state.meta;
    this.getTodoList(page, per_page);
    this.getLabels();
  }

  async getLabels() {
    try {
      const { data } = await github.get(
        `/repos/${CONFIG.owner}/${CONFIG.todo_repo}/labels`
      );
      this.props.updateTodoLabel(data);
    } catch (err) {
      console.error(err);
    }
  }

  async getAllTodoList(page, per_page, todoList = []) {
    try {
      const { data } = await github.get(
        `/repos/${CONFIG.owner}/${CONFIG.todo_repo}/issues`,
        {
          params: { creator: CONFIG.owner, page, per_page, state: 'all' },
        }
      );
      todoList = todoList.concat(data || []);
      // 如果往后还有下一页，则继续请求，知道完为止
      if (data.length > 0 && data.length >= per_page) {
        todoList = await this.getAllTodoList(page + 1, per_page, todoList);
      }
    } catch (err) {
      console.error(err);
    }
    return todoList;
  }

  async getTodoList(page, per_page) {
    let todoList = [];
    try {
      todoList = await this.getAllTodoList(page, per_page);
    } catch (err) {
      console.error(err);
    }
    todoList.length && this.props.updateTodoList(todoList);
    return todoList;
  }

  parseBadge() {
    const badge = {};
    const todoList = this.props.TODOS || [];
    todoList.forEach(todo => {
      const labels = todo.labels;
      while (labels.length) {
        const label = labels.shift();
        if (!badge[label.name]) {
          badge[label.name] = {
            count: 1,
            label: label,
          };
        } else {
          badge[label.name].count = badge[label.name].count + 1;
        }
      }
    });
    this.setState({ badge });
  }

  render() {
    const todoList = this.props.TODOS || [];
    return (
      <DocumentTitle title={['TODO List']}>
        <Spin spinning={false}>
          <div className="toolbar-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/todos/index.js">
                  <a href="javascript: void 0" target="_blank">
                    <Icon
                      type="code"
                      style={{
                        fontSize: '3rem',
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <div style={{ padding: '0 2.4rem' }}>
              <h2 style={{ textAlign: 'center' }}>待办事项</h2>
            </div>
            <Menu
              mode="inline"
              className={'h100'}
              style={{ overflowY: 'auto', overflowX: 'hidden', borderRight: 0 }}
            >
              {todoList.map((todo, i) => {
                return (
                  <Menu.Item
                    className="todo-list"
                    style={{
                      borderBottom: '1px solid #e6e6e6',
                      backgroundColor:
                        (todo.labels || []).findIndex(
                          label => label.name === this.state.currentLabel
                        ) >= 0
                          ? '#E0E0E0'
                          : null,
                    }}
                    key={todo.number + '/' + i}
                  >
                    <NavLink
                      exact={true}
                      to={`/todo/${todo.number}`}
                      style={{
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      <Tag
                        color={todo.state === 'open' ? 'blue' : 'grey'}
                        className="hidden-xs"
                      >
                        {todo.state === 'open' ? (
                          <span>&nbsp;Open&nbsp;</span>
                        ) : (
                          <span>Closed</span>
                        )}
                      </Tag>
                      <span
                        style={{ marginRight: '0.5rem' }}
                        className="hidden-xs"
                      >
                        {moment(todo.created_at).format('YY/MM/DD')}
                      </span>
                      <span
                        style={{
                          color: todo.state !== 'open' ? '#9E9E9E' : 'inherit',
                        }}
                      >
                        {todo.title}
                      </span>
                      <span style={{ float: 'right' }} className="hidden-xs">
                        {todo.labels.map(label => {
                          return (
                            <Tag key={label.id} color={'#' + label.color}>
                              {label.name}
                            </Tag>
                          );
                        })}
                      </span>
                    </NavLink>
                  </Menu.Item>
                );
              })}

              {this.state.meta.total > 0 ? (
                <Menu.Item>
                  <Row className="text-center">
                    <Col
                      span={24}
                      style={{
                        transition: 'all 1s',
                      }}
                    >
                      <Pagination
                        simple
                        onChange={page =>
                          this.changePage(page, this.state.meta.per_page)
                        }
                        defaultCurrent={this.state.meta.page}
                        defaultPageSize={this.state.meta.per_page}
                        total={this.state.meta.total}
                      />
                    </Col>
                  </Row>
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu>
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  state => ({
    TODOS: state.TODOS,
    TODO_LABELS: state.TODO_LABELS,
  }),
  actions
)(withRouter(TodoList));
