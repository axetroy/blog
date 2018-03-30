/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { withRouter } from "react-router-dom";
import { Spin, Steps, Icon, Tooltip, Tag } from "antd";
import moment from "moment";

import DocumentTitle from "../../component/document-title";
import ViewSourceCode from "../../component/view-source-code";
import Comments from "../../component/comments";
import github from "../../lib/github";
import CONFIG from "../../config.json";
import { diffTime } from "../../lib/utils";

import actions from "../../redux/actions";

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
      const { data } = await github.get(
        `/repos/${CONFIG.owner}/${CONFIG.todo_repo}/issues/${number}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.html"
          },
          responseType: "text"
        }
      );
      todo = data;
    } catch (err) {
      console.error(err);
    }
    this.props.updateTodo(number, todo);
    return todo;
  }

  render() {
    const { number } = this.props.match.params;
    const todo = this.props.TODO[number] || {};
    return (
      <DocumentTitle title={[todo.title, "TODO"]}>
        <Spin spinning={!Object.keys(todo).length}>
          <div className="toolbar-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/todo/index.js">
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
            {todo.title ? (
              <h2 style={{ textAlign: "center", margin: "1rem 0" }}>
                {todo.title}
                <Tooltip placement="topLeft" title="编辑此页">
                  <a
                    href={`https://github.com/${CONFIG.owner}/${
                      CONFIG.todo_repo
                    }/issues/${todo.number}`}
                    target="_blank"
                  >
                    <Icon type="edit" />
                  </a>
                </Tooltip>
              </h2>
            ) : (
              ""
            )}
            <Steps
              style={{
                margin: "2rem 0"
              }}
            >
              <Steps.Step
                status="finish"
                title="创建计划"
                description={`${moment(new Date(todo.created_at)).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}`}
                icon={<Icon type="book" />}
              />
              <Steps.Step
                status={todo.closed_at ? "finish" : "wait"}
                title="进行中"
                description={
                  todo.closed_at
                    ? (() => {
                        const diff = diffTime(new Date(todo.created_at))(
                          new Date(todo.closed_at)
                        );
                        return `耗时${diff.days ? diff.days + "天" : ""} ${
                          diff.hours || diff.days ? diff.hours + "时" : ""
                        }${
                          diff.minutes || diff.hours ? diff.minutes + "分" : ""
                        }${diff.seconds}秒`;
                      })()
                    : "进行中..."
                }
                icon={<Icon type="clock-circle-o" />}
              />
              <Steps.Step
                status={todo.closed_at ? "finish" : "wait"}
                title="关闭计划"
                description={
                  todo.closed_at
                    ? `${moment(new Date(todo.closed_at)).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}`
                    : ""
                }
                icon={<Icon type="check" />}
              />
            </Steps>
            <div style={{ margin: "2rem 0" }}>
              {(todo.labels || []).map(label => {
                return (
                  <Tag key={label.id} color={"#" + label.color}>
                    {label.name}
                  </Tag>
                );
              })}
            </div>
            <div
              className="markdown-body"
              style={{
                fontSize: "1.6rem",
                minHeight: "20rem"
              }}
              dangerouslySetInnerHTML={{
                __html: todo.body_html
              }}
            />
            <Comments
              type="issues"
              owner={CONFIG.owner}
              repo="todo"
              number={todo.number}
            />
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(state => ({ TODO: state.TODO }), actions)(
  withRouter(Todo)
);
