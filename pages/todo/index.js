import { CheckCircleOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { format } from 'date-fns'
import Link from 'next/link'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'

async function getAllTodoList(page, per_page, todoList = []) {
  const { data } = await github.issues.listForRepo({
    owner: CONFIG.owner,
    repo: CONFIG.todo_repo,
    creator: CONFIG.owner,
    state: 'all',
    per_page,
    page,
    request: {
      // signal: controller.signal
    },
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

  return todoList
}

export default function TodoList(props) {
  const { todos } = props

  return (
    <DocumentTitle title={['待办事项']}>
      <div className="bg-white" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '2.4rem' }}>
          <h2 style={{ textAlign: 'center' }}>待办事项</h2>
        </div>
        {todos.map((todo, i) => {
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
                      backgroundColor: status === 2 ? '#2cbe4e' : '#cb2431',
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
                        overflow: 'hidden',
                      }}
                    >
                      <Link prefetch={false} href={`/todo/${todo.number}`}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                          style={{
                            color: '#fff',
                          }}
                        >
                          {todo.title}
                        </a>
                      </Link>
                    </h2>
                    <div style={{ margin: '1rem 0' }}>
                      <span>
                        <CheckCircleOutlined />
                        &nbsp;
                        {format(new Date(todo.created_at), 'yyyy-MM-dd')}
                        &nbsp;
                      </span>
                      <span style={{ float: 'right' }}>
                        {todo.labels.map((label) => {
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
      <style jsx>{`
        .active-tag {
          margin: 0 2rem;
          transform: translateY(-1rem);
        }

        .timeline .timeline-item:after,
        .timeline .timeline-item:before {
          content: '';
          display: block;
          width: 100%;
          clear: both;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .timeline {
          width: 90%;
          margin: 30px auto;
          position: relative;
          -webkit-transition: all 0.4s ease;
          -moz-transition: all 0.4s ease;
          -ms-transition: all 0.4s ease;
          transition: all 0.4s ease;
        }
        .timeline:before {
          content: '';
          width: 3px;
          height: 100%;
          background: #e3e3e3;
          left: 50%;
          top: 30px;
          position: absolute;
        }
        .timeline:after {
          content: '';
          clear: both;
          display: table;
          width: 100%;
        }
        .timeline .timeline-item {
          margin-bottom: 50px;
          position: relative;
        }

        .timeline .timeline-item .timeline-icon {
          width: 50px;
          height: 50px;
          position: absolute;
          top: 0;
          left: 50%;
          overflow: hidden;
          margin-left: -23px;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          -ms-border-radius: 50%;
          border-radius: 50%;
          display: flex;
        }
        .timeline .timeline-item .timeline-icon img {
          position: relative;
          width: 32px;
          height: 32px;
          margin: auto;
        }
        .timeline .timeline-item .timeline-content {
          width: 45%;
          background: #fff;
          padding: 15px 15px 5px 20px;
          -webkit-box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          -moz-box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          -ms-box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -ms-border-radius: 5px;
          border-radius: 5px;
          -webkit-transition: all 0.3s ease;
          -moz-transition: all 0.3s ease;
          -ms-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }
        .timeline .timeline-item .timeline-content h2 {
          padding: 15px;
          background: #cb2431;
          color: #fff;
          margin: -20px -20px 0 -20px;
          font-weight: 500;
          -webkit-border-radius: 3px 3px 0 0;
          -moz-border-radius: 3px 3px 0 0;
          -ms-border-radius: 3px 3px 0 0;
          border-radius: 3px 3px 0 0;
        }

        .timeline .timeline-item .timeline-content:before {
          content: '';
          position: absolute;
          left: 45.5%;
          top: 20px;
          width: 0;
          height: 0;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
          border-left: 7px solid #cb2431;
        }
        .timeline .timeline-item .timeline-content.right {
          float: right;
        }
        .timeline .timeline-item .timeline-content.right:before {
          content: '';
          right: 45%;
          left: inherit;
          border-left: 0;
          border-right: 7px solid #cb2431;
        }
        .btn {
          padding: 5px 15px;
          text-decoration: none;
          background: transparent;
          border: 2px solid #f27c7c;
          color: #f27c7c;
          display: inline-block;
          position: relative;
          text-transform: uppercase;
          font-size: 12px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -ms-border-radius: 5px;
          border-radius: 5px;
          -webkit-transition: background 0.3s ease;
          -moz-transition: background 0.3s ease;
          -ms-transition: background 0.3s ease;
          transition: background 0.3s ease;
          -webkit-box-shadow: 2px 2px 0 #f27c7c;
          -moz-box-shadow: 2px 2px 0 #f27c7c;
          -ms-box-shadow: 2px 2px 0 #f27c7c;
          box-shadow: 2px 2px 0 #f27c7c;
        }
        .btn:hover {
          box-shadow: none;
          top: 2px;
          left: 2px;
          -webkit-box-shadow: 2px 2px 0 transparent;
          -moz-box-shadow: 2px 2px 0 transparent;
          -ms-box-shadow: 2px 2px 0 transparent;
          box-shadow: 2px 2px 0 transparent;
        }
        @media screen and (max-width: 768px) {
          .timeline {
            margin: 30px;
            padding: 0;
          }
          .timeline:before {
            left: 0;
          }
          .timeline .timeline-item .timeline-content {
            width: 90%;
            float: right;
          }
          .timeline .timeline-item .timeline-content:before,
          .timeline .timeline-item .timeline-content.right:before {
            left: 10%;
            margin-left: -6px;
            border-left: 0;
            border-right: 7px solid #cb2431;
          }
          .timeline .timeline-item .timeline-icon {
            left: 0;
          }
        }

        /* 不同状态下的颜色 */

        .timeline.status-2 .timeline-content h2 {
          background: #2cbe4e !important;
        }

        .timeline.status-2 .timeline-content.right:before {
          border-left: 0 !important;
          border-right: 7px solid #2cbe4e !important;
        }

        .timeline.status-2 .timeline-content:before {
          border-right: 0 !important;
          border-left: 7px solid #2cbe4e !important;
        }
      `}</style>
    </DocumentTitle>
  )
}

export async function getServerSideProps(context) {
  const todos = await getAllTodoList(1, 20)

  return {
    props: {
      todos,
    },
  }
}
