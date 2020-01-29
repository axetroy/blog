import { Icon, Tag } from 'antd'
import { format } from 'date-fns'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'
import actions from '../../redux/actions'
import './index.css'

function TodoList(props) {
  const { TODOS, updateTodoList } = props

  const controller = new AbortController()

  async function getAllTodoList(page, per_page, todoList = []) {
    const { data } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: CONFIG.todo_repo,
      creator: CONFIG.owner,
      state: 'all',
      per_page,
      page,
      request: {
        signal: controller.signal
      }
    })

    if (!data) {
      return
    }

    todoList = todoList.concat(data)
    // 如果往后还有下一页，则继续请求，知道完为止
    if (data.length > 0 && data.length >= per_page) {
      // @ts-ignore
      todoList = await getAllTodoList(page + 1, per_page, todoList)
    }

    updateTodoList(todoList)
  }

  useEffect(() => {
    getAllTodoList().catch(() => {})
    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DocumentTitle title={['待办事项']}>
      <div className="bg-white" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '2.4rem' }}>
          <h2 style={{ textAlign: 'center' }}>待办事项</h2>
        </div>
        {TODOS.map((todo, i) => {
          let status = 0
          let statusText = '未开始'
          let icon = 'undone'

          for (const label of todo.labels) {
            switch (label.name) {
              case '未开始':
                status = 0
                statusText = '未开始'
                break
              case '进行中':
                status = 1
                statusText = '进行中'
                icon = 'doing'
                break
              case '已完成':
                status = 2
                statusText = '已完成'
                icon = 'done'
                break
              case '暂搁置':
                status = 3
                statusText = '暂搁置'
                icon = 'stop'
                break
              case '已废弃':
                status = -1
                statusText = '已废弃'
                icon = 'cancel'
                break
              default:
            }
          }

          return (
            <div className="container" key={todo.title}>
              <div className={'timeline status-' + status}>
                <div className="timeline-item">
                  <div
                    className="timeline-icon"
                    style={{
                      backgroundColor: status === 2 ? '#2cbe4e' : '#cb2431'
                    }}
                    title={statusText}
                  >
                    <img src={`./icon/${icon}.svg`} alt={statusText} />
                  </div>
                  <div
                    className={
                      'timeline-content' +
                      (status === 2 || status === -1 ? ' right' : '')
                    }
                  >
                    <h2
                      style={{
                        whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      <NavLink
                        exact={true}
                        to={`/todo/${todo.number}`}
                        style={{
                          color: '#fff'
                        }}
                      >
                        {todo.title}
                      </NavLink>
                    </h2>
                    <div style={{ margin: '1rem 0' }}>
                      <span>
                        <Icon type="clock-circle-o" />
                        &nbsp;
                        {format(new Date(todo.created_at), 'yyyy-MM-dd')}
                        &nbsp;
                      </span>
                      <span style={{ float: 'right' }}>
                        {todo.labels.map(label => {
                          return (
                            <Tag key={label.id} color={'#' + label.color}>
                              {label.name}
                            </Tag>
                          )
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DocumentTitle>
  )
}

export default connect(
  state => ({
    TODOS: state.TODOS
  }),
  actions
)(TodoList)
