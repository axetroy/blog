/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Steps, Icon } from 'antd';
import moment from 'moment';

import github from '../../lib/github';
import * as todoAction from '../../redux/todo';
import pkg from '../../../package.json';

class Todo extends Component {
  state = {};

  async componentWillMount() {
    let { number } = this.props.match.params;
    if (number) {
      await this.getTodo(number);
    }
  }

  async componentWillReceiveProps(nextProp) {
    const { number } = nextProp.match.params;
    if (number && number !== this.props.match.params.number) {
      await this.getTodo(nextProp.match.params.number);
    }
  }

  async getTodo(number) {
    let todo = {};
    try {
      const {
        data
      } = await github.get(
        `/repos/${pkg.config.owner}/${pkg.config.todo_repo}/issues/${number}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      todo = data;
    } catch (err) {
      console.error(err);
    }
    this.props.setTodo({ [number]: todo });
    return todo;
  }

  render() {
    const { number } = this.props.match.params;
    const todo = this.props.TODO[number] || {};
    return (
      <Spin spinning={!Object.keys(todo).length}>
        <div style={{ padding: '2.4rem' }}>
          <h2>{todo.title}</h2>
          <Steps>
            <Steps.Step
              status="finish"
              title="创建计划"
              description={`${moment(new Date(todo.created_at)).format('YYYY-MM-DD HH:mm:ss')}`}
              icon={<Icon type="book" />}
            />
            <Steps.Step
              status={todo.closed_at ? 'finish' : 'wait'}
              title="进行中"
              description={todo.closed_at ? `耗时xxx天` : '进行中...'}
              icon={<Icon type="clock-circle-o" />}
            />
            <Steps.Step
              status={todo.closed_at ? 'finish' : 'wait'}
              title="已完成"
              description={
                todo.closed_at
                  ? `${moment(new Date(todo.closed_at)).format('YYYY-MM-DD HH:mm:ss')}`
                  : ''
              }
              icon={<Icon type="check" />}
            />
          </Steps>
          <div
            className="markdown-body"
            style={{ fontSize: '1.6rem', minHeight: '20rem' }}
            dangerouslySetInnerHTML={{
              __html: todo.body_html
            }}
          />
        </div>

      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { TODO: state.TODO };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setTodo: todoAction.set
      },
      dispatch
    );
  }
)(Todo);
