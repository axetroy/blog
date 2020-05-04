import { Button } from 'antd'
import { ExceptionOutlined } from '@ant-design/icons'
import React, { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'

import CONFIG from '../config.json'
import { github } from '../lib/github'
import './todo.css'

export function Todo() {
  const [meta, setMeta] = useState({ page: 1, per_page: 10, total: 0 })
  const [todoList, setTodoList] = useState([])
  const [hashNextpage, setHashNextpage] = useState(false)
  const [loading, setLoading] = useState(false)

  // const controller = new AbortController()

  useEffect(() => {
    const { page, per_page } = meta
    getTodoList(page, per_page)
      .then(list => {
        setTodoList(list)
        setHashNextpage(list.length > 0 && list.length >= per_page)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return function() {
      // controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getTodoList(page, per_page) {
    setLoading(true)
    const { data } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: CONFIG.todo_repo,
      creator: CONFIG.owner,
      state: 'open',
      per_page,
      page,
      request: {
        // signal: controller.signal
      }
    })
    setLoading(false)
    setHashNextpage(data.length > 0 && data.length >= per_page)
    return data
  }

  async function getNextTodoList() {
    const { page, per_page } = meta
    const nextPage = page + 1
    const nextList = await getTodoList(nextPage, per_page)
    if (nextList.length) {
      const hash = {}
      const newList = todoList.concat(nextList).filter(v => {
        if (!hash[v.id]) {
          hash[v.id] = true
          return true
        } else {
          return false
        }
      })

      setTodoList(newList)
      setMeta({
        ...meta,
        page: nextPage
      })
    }
  }

  return (
    <div className="widget widget-todo">
      <div className="widget-header">
        <h3>
          <Link href="/todo">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <ExceptionOutlined className="middle" />
              <span className="middle">Todo</span>
            </a>
          </Link>
        </h3>
      </div>

      <ul className="todo-list">
        {todoList.map((todo, i) => {
          let statusText = '未开始'
          let icon = 'undone'

          for (const label of todo.labels || []) {
            switch (label.name) {
              case '未开始':
                statusText = '未开始'
                break
              case '进行中':
                statusText = '进行中'
                icon = 'doing'
                break
              case '已完成':
                statusText = '已完成'
                icon = 'done'
                break
              case '暂搁置':
                statusText = '暂搁置'
                icon = 'stop'
                break
              case '已废弃':
                statusText = '已废弃'
                icon = 'cancel'
                break
              default:
            }
          }

          return (
            <li className={`todo-item todo-${icon}`} key={todo.number}>
              <Link prefetch={false} href={`/todo/${todo.number}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{todo.title}</a>
              </Link>
            </li>
          )
        })}
        {hashNextpage ? (
          <li className="more">
            <Button
              type="default"
              loading={loading}
              onClick={() => getNextTodoList()}
            >
              {loading ? 'Loading' : 'More'}
            </Button>
          </li>
        ) : (
          ''
        )}
      </ul>
    </div>
  )
}
