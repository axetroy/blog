import React, { useState, useEffect } from 'react'

export default function Now(props) {
  const { interval, children } = props

  if (typeof children !== 'function') {
    throw new Error(
      `react-now component's child must contain only one function`
    )
  }

  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return function() {
      clearInterval(timer)
    }
  }, [interval])

  const reactElement = children.call(this, currentDate)

  if (!React.isValidElement(reactElement)) {
    throw new Error(`react-now: Function not return a valid react element`)
  }

  return reactElement
}
