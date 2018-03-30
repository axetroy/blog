/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Row, Col, Menu, Pagination, Spin, Tag, Icon, Tooltip } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import moment from "moment";

import DocumentTitle from "../../component/document-title";
import ViewSourceCode from "../../component/view-source-code";
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
          params: { creator: CONFIG.owner, page, per_page, state: "all" }
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
            label: label
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
      <DocumentTitle title={["TODO List"]}>
        <Spin spinning={false}>
          <Col className="toolbar-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/todos/index.js">
                  <a href="javascript: void 0" target="_blank">
                    <Icon
                      type="code"
                      style={{
                        fontSize: "3rem"
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <div style={{ padding: "0 2.4rem" }}>
              <h2 style={{ textAlign: "center" }}>待办事项</h2>
            </div>
            {todoList.map((todo, i) => {
              const closed = todo.state !== "open";
              const done = todo.labels.find(label => label.name === "已完成");
              return (
                <div className="container" key={todo.title}>
                  <div id="timeline">
                    <div className="timeline-item">
                      <div
                        className="timeline-icon"
                        style={{
                          backgroundColor: done ? "#2cbe4e" : "#cb2431"
                        }}
                      >
                        <img
                          src={`./icon/${done ? "done" : "undone"}.svg`}
                          alt=""
                        />
                      </div>
                      <div
                        className={"timeline-content" + (done ? " right" : "")}
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
          </Col>
        </Spin>
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
