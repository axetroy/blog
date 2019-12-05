import React, { Component } from "react";
import PropTypes from "prop-types";
import Clipboard from "clipboard";

export default class ReactClipboard extends Component {
  static propTypes = {
    value: PropTypes.string,
    onSuccess: PropTypes.func,
    onError: PropTypes.func
  };

  componentDidMount() {
    if (this.refs.container) {
      // @ts-ignore
      const clipboard = new Clipboard(this.refs.container, {
        text: () => this.props.value
      });

      clipboard.on("success", event => {
        if (typeof this.props.onSuccess === "function") {
          this.props.onSuccess(event);
        }
      });

      clipboard.on("error", event => {
        if (typeof this.props.onError === "function") {
          this.props.onError(event);
        }
      });

      this.__Clipboard = clipboard;
    }
  }

  componentWillUnmount() {
    this.__Clipboard && this.__Clipboard.destroy();
  }

  render() {
    return (
      <div
        className={
          "react-clipboard-wrapper" +
          (this.props.className ? " " + this.props.className : "")
        }
        style={{ display: "inline-block", ...this.props.style }}
        ref="container"
      >
        {this.props.children}
      </div>
    );
  }
}
