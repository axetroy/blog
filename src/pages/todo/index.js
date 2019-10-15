/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { withRouter } from "react-router-dom";
import { Steps, Icon, Tooltip, Tag } from "antd";
import { format } from "date-fns";

import DocumentTitle from "../../component/document-title";
import Comments from "../../component/comments";
import github from "../../lib/github";
import CONFIG from "../../config.json";
import { diffTime, enableIframe } from "../../lib/utils";

import actions from "../../redux/actions";

class Todo extends Component {
  state = {};

  async UNSAFE_componentWillMount() {
    let { number } = this.props.match.params;
    if (number) {
      await this.getTodo(number);
    }
  }

  async UNSAFE_componentWillReceiveProps(nextProp) {
    const { number } = nextProp.match.params;
    if (number && number !== this.props.match.params.number) {
      await this.getTodo(nextProp.match.params.number);
    }
  }

  async getTodo(number) {
    let todo = {};
    try {
      const { data } = await github.issues.get({
        owner: CONFIG.owner,
        repo: CONFIG.todo_repo,
        issue_number: number,
        headers: {
          Accept: "application/vnd.github.v3.html"
        }
      });
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
      <DocumentTitle title={[todo.title, "待办事项"]}>
        <div
          className="bg-white"
          style={{ padding: "0 1rem", marginBottom: 20 }}
        >
          {todo.title ? (
            <h2 style={{ textAlign: "center", padding: "1rem 0" }}>
              {todo.title}
              <Tooltip placement="topLeft" title="编辑此页">
                <a
                  rel="noopener noreferrer"
                  href={`https://github.com/${CONFIG.owner}/${CONFIG.todo_repo}/issues/${todo.number}`}
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
              description={`${format(
                new Date(todo.created_at),
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
                  ? `${format(new Date(todo.closed_at), "yyyy-MM-dd HH:mm:ss")}`
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
              __html: enableIframe(todo.body_html)
            }}
          />
          <div className="comment-box">
            <Comments
              type="issues"
              owner={CONFIG.owner}
              repo="todo"
              number={todo.number}
            />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
export default connect(
  state => ({ TODO: state.TODO }),
  actions
)(withRouter(Todo));
