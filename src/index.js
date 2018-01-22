// @flow
// polyfill
import FastClick from "fastclick";
import React from "react";
import ReactDOM from "react-dom";
// import dva from "dva";
import { Router, Route } from "dva/router";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { onStoreDone } from "./redux/createStore";
import { init } from "./lib/firebase";

FastClick.attach(document.body);

// always render the component after Redux store are ready
onStoreDone(function() {
  // wait firebase login done
  init(function() {});
  // ReactDOM.render(
  //   <App style={{ height: '100%' }} />,
  //   document.getElementById('root')
  // );
  // const app = dva();
  // console.log(123, app._store);
  // app.router(({ history }) => <App style={{ height: "100%" }} />);
  // app.start("#root");
});

ReactDOM.render(
  <App style={{ height: '100%' }} />,
  document.getElementById('root')
);

registerServiceWorker();
