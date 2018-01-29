// polyfill
import FastClick from 'fastclick';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { init } from './lib/firebase';

FastClick.attach(document.body);

init(function() {});

ReactDOM.render(
  <App style={{ height: '100%' }} />,
  document.getElementById('root')
);

registerServiceWorker();
