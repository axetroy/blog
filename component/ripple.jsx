import React, { useEffect, useState, useRef } from 'react'
import debounce from 'lodash.debounce'

export function Ripple(props) {
  const { style, children } = props
  const [enable, setEnable] = useState(false)
  const [ele, setEle] = useState(null)
  const [timers, setTimers] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    const resize = debounce(function resize() {
      if (window.innerWidth <= 576) {
        setEnable(false)
      } else {
        setEnable(true)
      }
    }, 100)

    resize()

    window.addEventListener('resize', resize)

    const width = 200
    const height = 200
    const ele = document.createElement('span')
    ele.classList.add('ripple')
    ele.style.width = `${width}px`
    ele.style.height = `${height}px`
    setEle(ele)

    return function() {
      window.removeEventListener('resize', resize)
    }
  }, [])

  function onClick(event) {
    if (!enable) return

    const { pageX, pageY } = event
    const width = 200
    const height = 200

    if (!ele) return

    const element = ele.cloneNode(true)
    element.style.left = `${pageX - width / 2}px`
    element.style.top = `${pageY - height / 2}px`
    containerRef.current.appendChild(element)

    const timerID = setTimeout(() => {
      element.remove()

      const index = timers.findIndex(v => v === timerID)

      if (index >= 0) {
        timers.splice(index, 1) // remove
        setTimers(timers)
      }
    }, 750)

    const newTimers = timers.concat([timerID])

    setTimers(newTimers)
  }

  return (
    <div onClick={onClick} ref={containerRef} style={style || {}}>
      {children}
      <style jsx>{`
        .ripple {
          position: absolute;
          z-index: 99999999;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 100%;
          transform: scale(0);
          pointer-events: none;
          animation: ripple 0.75s ease-out;
        }

        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
