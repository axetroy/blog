// polyfill
import FastClick from 'fastclick'
import React from 'react'
import { hydrate, render } from 'react-dom'
import App from './app'
import { register } from './registerServiceWorker'

// @ts-ignore
FastClick.attach(document.body)

const root = document.getElementById('root')

if (root.hasChildNodes()) {
  hydrate(<App style={{ width: '100%', height: '100%' }} />, root)
} else {
  render(<App style={{ width: '100%', height: '100%' }} />, root)
}

register()
