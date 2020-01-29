import React, { useRef, useEffect } from 'react'
import Clipboard from 'clipboard'

export default function ReactClipboard(props) {
  const { className, style, children, value, onSuccess, onError } = props

  const containerRef = useRef(null)

  useEffect(() => {
    const dom = containerRef.current

    const clipboard = new Clipboard(dom, {
      text: () => value
    })

    clipboard.on('success', event => {
      if (typeof onSuccess === 'function') {
        onSuccess(event)
      }
    })

    clipboard.on('error', event => {
      if (typeof onError === 'function') {
        onError(event)
      }
    })

    return function cleanup() {
      clipboard.destroy()
    }
  }, [onError, onSuccess, value])

  return (
    <div
      className={'react-clipboard-wrapper' + (className ? ' ' + className : '')}
      style={{ display: 'inline-block', ...style }}
      ref={containerRef}
    >
      {children}
    </div>
  )
}
