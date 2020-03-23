import { Spin } from 'antd'
import React, { Suspense } from 'react'

export default function DynamicLoad(props) {
  const { import: importFunc } = props

  const Target = React.lazy(importFunc)

  return (
    <Suspense
      fallback={
        <Spin
          spinning={true}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '20rem',
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: '0.4rem',
            zIndex: 99999999,
            marginTop: '0.4rem'
          }}
        ></Spin>
      }
    >
      <Target />
    </Suspense>
  )
}
