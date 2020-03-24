import { Icon, Steps, Tag, Tooltip } from 'antd'
import { format } from 'date-fns'
import React from 'react'
import {
  EditOutlined,
  BookOutlined,
  CheckOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

import Comments from '../../component/comment'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'
import { diffTime, enableIframe } from '../../lib/utils'

export default function Todo(props) {
  const { todo } = props

  return (
    <DocumentTitle title={[todo.title, '待办事项']}>
      <div className="bg-white" style={{ padding: '0 1rem', marginBottom: 20 }}>
        {todo.title ? (
          <h2 style={{ textAlign: 'center', padding: '1rem 0' }}>
            {todo.title}
            <Tooltip placement="topLeft" title="编辑此页">
              <a
                rel="noopener noreferrer"
                href={`https://github.com/${CONFIG.owner}/${CONFIG.todo_repo}/issues/${todo.number}`}
                target="_blank"
              >
                <EditOutlined />
              </a>
            </Tooltip>
          </h2>
        ) : (
          ''
        )}
        <Steps
          style={{
            margin: '2rem 0'
          }}
        >
          <Steps.Step
            status="finish"
            title="创建计划"
            description={
              todo.created_at
                ? `${format(new Date(todo.created_at), 'yyyy-MM-dd HH:mm:ss')}`
                : ''
            }
            icon={<BookOutlined />}
          />
          <Steps.Step
            status={todo.closed_at ? 'finish' : 'wait'}
            title="进行中"
            description={
              todo.closed_at
                ? (() => {
                    const diff = diffTime(new Date(todo.created_at))(
                      new Date(todo.closed_at)
                    )
                    return `耗时${diff.days ? diff.days + '天' : ''} ${
                      diff.hours || diff.days ? diff.hours + '时' : ''
                    }${diff.minutes || diff.hours ? diff.minutes + '分' : ''}${
                      diff.seconds
                    }秒`
                  })()
                : '进行中...'
            }
            icon={<CheckCircleOutlined />}
          />
          <Steps.Step
            status={todo.closed_at ? 'finish' : 'wait'}
            title="关闭计划"
            description={
              todo.closed_at
                ? `${format(new Date(todo.closed_at), 'yyyy-MM-dd HH:mm:ss')}`
                : ''
            }
            icon={<CheckOutlined />}
          />
        </Steps>
        <div style={{ margin: '2rem 0' }}>
          {(todo.labels || []).map(label => {
            return (
              <Tag key={label.id} color={'#' + label.color}>
                {label.name}
              </Tag>
            )
          })}
        </div>
        <div
          className="markdown-body"
          style={{
            fontSize: '1.6rem',
            minHeight: '20rem'
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
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  const { data: todo } = await github.issues.get({
    owner: CONFIG.owner,
    repo: CONFIG.todo_repo,
    issue_number: id,
    headers: {
      Accept: 'application/vnd.github.v3.html'
    },
    request: {
      // signal: controller.signal
    }
  })

  return {
    props: {
      todo
    }
  }
}
