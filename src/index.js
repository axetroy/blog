// polyfill
import FastClick from 'fastclick';
FastClick.attach(document.body);

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import { onStoreDone } from './redux/createStore';

onStoreDone(function() {
  // always render the component after Redux store are ready
  ReactDOM.render(
    <App style={{ height: '100%' }} />,
    document.getElementById('root')
  );
});
