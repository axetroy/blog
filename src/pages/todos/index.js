/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Tag, Icon } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import moment from "moment";

import DocumentTitle from "../../component/document-title";
import github from "../../lib/github";
import CONFIG from "../../config.json";

import actions from "../../redux/actions";

import "./index.css";

class TodoList extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 100,
      total: 0
    },
    currentLabel: "",
    badge: {}
  };

  componentWillMount() {
    const { page, per_page } = this.state.meta;
    this.getTodoList(page, per_page);
    this.getLabels();
  }

  async getLabels() {
    try {
      const { data } = await github.issues.listForRepo({
        owner: CONFIG.owner,
        repo: CONFIG.todo_repo,
        client_id: CONFIG.github_client_id,
        client_secret: CONFIG.github_client_secret
      });
      this.props.updateTodoLabel(data);
    } catch (err) {
      console.error(err);
    }
  }

  async getAllTodoList(page, per_page, todoList = []) {
    try {
      const { data } = await github.issues.listForRepo({
        owner: CONFIG.owner,
        repo: CONFIG.todo_repo,
        creator: CONFIG.owner,
        state: "all",
        per_page,
        page,
        client_id: CONFIG.github_client_id,
        client_secret: CONFIG.github_client_secret
      });
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
            label: label
          };
        } else {
          badge[label.name].count = badge[label.name].count + 1;
        }
      }
    });
    this.setState({ badge });
    return badge;
  }

  render() {
    const todoList = this.props.TODOS || [];
    return (
      <DocumentTitle title={["待办事项"]}>
        <div className="bg-white">
          <div style={{ padding: "2.4rem" }}>
            <h2 style={{ textAlign: "center" }}>待办事项</h2>
          </div>
          {todoList.map((todo, i) => {
            let status = 0;
            let statusText = "未开始";
            let icon = "undone";

            for (const label of todo.labels) {
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
              <div className="container" key={todo.title}>
                <div className={"timeline status-" + status}>
                  <div className="timeline-item">
                    <div
                      className="timeline-icon"
                      style={{
                        backgroundColor: status === 2 ? "#2cbe4e" : "#cb2431"
                      }}
                      title={statusText}
                    >
                      <img src={`./icon/${icon}.svg`} alt={statusText} />
                    </div>
                    <div
                      className={
                        "timeline-content" +
                        (status === 2 || status === -1 ? " right" : "")
                      }
                    >
                      <h2
                        style={{
                          whiteSpace: "nowrap",
                          wordBreak: "break-all",
                          textOverflow: "ellipsis",
                          overflow: "hidden"
                        }}
                      >
                        <NavLink
                          exact={true}
                          to={`/todo/${todo.number}`}
                          style={{
                            color: "#fff"
                          }}
                        >
                          {todo.title}
                        </NavLink>
                      </h2>
                      <div style={{ margin: "1rem 0" }}>
                        <span>
                          <Icon type="clock-circle-o" />{" "}
                          {moment(todo.created_at).format("YYYY-MM-DD")}{" "}
                        </span>
                        <span style={{ float: "right" }}>
                          {todo.labels.map(label => {
                            return (
                              <Tag key={label.id} color={"#" + label.color}>
                                {label.name}
                              </Tag>
                            );
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DocumentTitle>
    );
  }
}
export default connect(
  state => ({
    TODOS: state.TODOS,
    TODO_LABELS: state.TODO_LABELS
  }),
  actions
)(withRouter(TodoList));
