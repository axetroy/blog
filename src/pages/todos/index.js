/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu, Pagination, Spin, Tag } from 'antd';
import { NavLink } from 'react-router-dom';

import DocumentTitle from '../../component/document-title';
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
      <DocumentTitle title="TODO List">
        <Spin spinning={false}>
          <div style={{ padding: '0 2.4rem', fontSize: '1.6rem' }}>
            <p>我觉得我的拖延症还可以抢救一下</p>
            <p>采取的措施是，用任务B去拖延任务A</p>
            <p>虽然我没有完成任务A, 但是我完成了任务B</p>
            <p>而完成任务的成就感支持着我进行下一个任务</p>
            <p>这也是斯坦福教授John Perry提倡的“结构化拖延法”, 还得了诺贝尔奖:)</p>
          </div>
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
                    <Tag color={todo.state === 'open' ? 'blue' : 'grey'}>
                      {todo.state === 'open' ? 'Open' : 'Closed'}
                    </Tag>
                    <span
                      style={{
                        color: todo.state !== 'open' ? '#9E9E9E' : 'inherit'
                      }}
                    >
                      {todo.title}
                    </span>
                    <span style={{ marginLeft: '0.5rem' }}>
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
      </DocumentTitle>
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
