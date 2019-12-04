// polyfill
import FastClick from "fastclick";
import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import App from "./app";

window.__localeId__ = "zh-cn";

FastClick.attach(document.body);

ReactDOM.render(
  <App style={{ width: "100%", height: "100%" }} />,
  document.getElementById("root")
);

registerServiceWorker();
