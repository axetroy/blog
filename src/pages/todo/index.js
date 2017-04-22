/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from 'antd';

import github from '../../lib/github';
import * as todoAction from '../../redux/todo';
import pkg from '../../../package.json';

class Todo extends Component {
  state = { comments: [] };

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
      this.getComments(pkg.config.owner, pkg.config.repo, number);
    } catch (err) {
      console.error(err);
    }
    this.props.setTodo({ [number]: todo });
    return todo;
  }

  async getComments(owner, repo, number) {
    let comments = [];
    try {
      const {
        data
      } = await github.get(
        `/repos/${owner}/${repo}/issues/${number}/comments`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        }
      );
      this.setState({ comments: data });
    } catch (err) {
      console.error(err);
    }
    return comments;
  }

  render() {
    const { number } = this.props.match.params;
    const todo = this.props.TODO[number] || {};
    return (
      <Spin spinning={!Object.keys(todo).length}>
        <div style={{ padding: '2.4rem' }}>
          <h2>{todo.title}</h2>
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
