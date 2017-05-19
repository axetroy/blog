// @flow
// polyfill
import FastClick from 'fastclick';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { onStoreDone } from './redux/createStore';

FastClick.attach(document.body);

onStoreDone(function() {
  // always render the component after Redux store are ready
  ReactDOM.render(
    <App style={{ height: '100%' }} />,
    document.getElementById('root')
  );
});

registerServiceWorker();
