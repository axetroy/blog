// polyfill
import FastClick from "fastclick";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

FastClick.attach(document.body);

ReactDOM.render(
  <App style={{ height: "100%" }} />,
  document.getElementById("root")
);

registerServiceWorker();
