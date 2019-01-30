/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Icon, Button } from "antd";
import { NavLink, withRouter } from "react-router-dom";

import github from "../lib/github";
import CONFIG from "../config.json";
import actions from "../redux/actions";

import "./todo.css";

class TodoList extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
      total: 0
    },
    todoList: [],
    hashNextpage: false
  };

  componentDidMount() {
    const { page, per_page } = this.state.meta;
    this.getTodoList(page, per_page).then(todoList => {
      this.setState({
        todoList,
        hashNextpage: todoList.length > 0 && todoList.length >= per_page
      });
    });
  }

  componentDidCatch(err) {
    console.error(err);
  }

  async getAllTodoList(page, per_page, todoList = []) {
    const { data } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: CONFIG.todo_repo,
      filter: "created",
      state: "all",
      per_page,
      page,
      client_id: CONFIG.github_client_id,
      client_secret: CONFIG.github_client_secret
    });
    todoList = todoList.concat(data || []);
    // 如果往后还有下一页，则继续请求，知道完为止
    if (data.length > 0 && data.length >= per_page) {
      // todoList = await this.getAllTodoList(page + 1, per_page, todoList);
    }
    return todoList;
  }

  async getTodoList(page, per_page) {
    this.setState({ loading: true });
    const todoList = await this.getAllTodoList(page, per_page);
    this.setState({
      loading: false,
      hashNextpage: todoList.length > 0 && todoList.length >= per_page
    });
    return todoList;
  }

  async getNextTodoList() {
    const { page, per_page } = this.state.meta;
    const nextPage = page + 1;
    const nextTodoList = await this.getTodoList(nextPage, per_page);
    if (nextTodoList.length) {
      const hash = {};
      const newTodoList = this.state.todoList.concat(nextTodoList).filter(v => {
        if (!hash[v.id]) {
          hash[v.id] = true;
          return true;
        } else {
          return false;
        }
      });
      this.setState({
        meta: {
          ...this.state.meta,
          page: nextPage
        },
        todoList: newTodoList
      });
    }
  }

  render() {
    return (
      <div className="widget widget-todo">
        <div>
          <h2>
            <NavLink to="/todo">
              <Icon className="middle" type="exception" />
              <span className="middle">Todo</span>
            </NavLink>
          </h2>
        </div>

        <ul className="todo-list">
          {this.state.todoList.map((todo, i) => {
            let status = 0;
            let statusText = "未开始";
            let icon = "undone";

            for (const label of todo.labels || []) {
              switch (label.name) {
                case "未开始":
                  status = 0;
                  statusText = "未开始";
                  break;
                case "进行中":
                  status = 1;
                  statusText = "进行中";
                  icon = "doing";
                  break;
                case "已完成":
                  status = 2;
                  statusText = "已完成";
                  icon = "done";
                  break;
                case "暂搁置":
                  status = 3;
                  statusText = "暂搁置";
                  icon = "stop";
                  break;
                case "已废弃":
                  status = -1;
                  statusText = "已废弃";
                  icon = "cancel";
                  break;
                default:
              }
            }

            return (
              <li className={`todo-item todo-${icon}`} key={todo.title}>
                <NavLink title={statusText} status={status} exact={true} to={`/todo/${todo.number}`}>
                  {todo.title}
                </NavLink>
              </li>
            );
          })}
          {this.state.hashNextpage ? (
            <li className="more">
              <Button
                type="default"
                loading={this.state.loading}
                onClick={() => this.getNextTodoList()}
              >
                {this.state.loading ? "Loading" : "More"}
              </Button>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    );
  }
}
export default connect(state => ({}), actions)(withRouter(TodoList));
