import { BookFilled, CheckCircleFilled, HomeFilled } from '@ant-design/icons'
import { Col, Menu, Row } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import Footer from '../component/footer'
import { Ripple } from '../component/ripple'
import { About as WidgetAbout } from '../widget/about'
import { Gist as WidgetGist } from '../widget/gist'
import { Stat as WidgetStat } from '../widget/stat'
import { Todo as WidgetTodo } from '../widget/todo'
import './layout.css'

const widthScreenRouter = [
  new RegExp(`^/todo(/d+)?`),
  new RegExp(`^/gist(/d+)?`),
  new RegExp(`^/stackoverflow(/d+)?`),
]

const contentLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 15, offset: 1 },
  xl: { span: 14, offset: 2 },
  xxl: { span: 13, offset: 3 },
}

const widgetLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 7, offset: 0 },
  xl: { span: 6, offset: 0 },
  xxl: { span: 5, offset: 0 },
}

const widthContentLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 18, offset: 3 },
  xl: { span: 18, offset: 3 },
  xxl: { span: 16, offset: 4 },
}

const widthWidgetLayout = {
  span: 0,
}

function Content(props) {
  const { children, widthScreenMode } = props
  return (
    <Row gutter={36} style={{ margin: 0 }}>
      <Col
        id="left"
        {...(widthScreenMode ? widthContentLayout : contentLayout)}
      >
        {children}
      </Col>
      <Col id="right" {...(widthScreenMode ? widthWidgetLayout : widgetLayout)}>
        <Widget />
      </Col>
    </Row>
  )
}

function Widget() {
  return (
    <Fragment>
      <WidgetAbout />
      <WidgetStat />
      <WidgetTodo />
      <WidgetGist />
    </Fragment>
  )
}

function Nav() {
  const location = useRouter()

  return (
    <Menu mode="horizontal" defaultSelectedKeys={[location.pathname]}>
      <Menu.Item key="/">
        <Link href="/index" as="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <HomeFilled />
            首页
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/todo">
        <Link href="/todo">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <CheckCircleFilled />
            待办事项
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/gist">
        <Link href="/gist">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <BookFilled />
            代码片段
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/stackoverflow">
        <Link href="/stackoverflow">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <BookFilled />
            踩过的坑
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  )
}

export function Layout(props) {
  const { children } = props
  const location = useRouter()

  let widthScreenMode = false

  for (const p of widthScreenRouter) {
    if (p.test(location.pathname)) {
      widthScreenMode = true
    }
  }

  return (
    <Ripple>
      <nav id="nav">
        <Nav />
      </nav>
      <main id="content">
        <Content widthScreenMode={widthScreenMode}>{children}</Content>
      </main>
      <Footer />
    </Ripple>
  )
}
