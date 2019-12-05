import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Download extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  };

  downloadFile(fileName, fileContent) {
    function fake_click(obj) {
      let ev = document.createEvent("MouseEvents");
      ev.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      obj.dispatchEvent(ev);
    }
    function export_raw(name, data) {
      let urlObject = window.URL || window.webkitURL || window;
      let export_blob = new Blob([data]);

      if ("msSaveBlob" in navigator) {
        // Prefer msSaveBlob if available - Edge supports a[download] but
        // ignores the filename provided, using the blob UUID instead.
        // msSaveBlob will respect the provided filename
        navigator.msSaveBlob(export_blob, name);
      } else if ("download" in HTMLAnchorElement.prototype) {
        let save_link = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "a"
        );
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fake_click(save_link);
      } else {
        throw new Error("Neither a[download] nor msSaveBlob is available");
      }
    }
    export_raw(fileName, fileContent);
  }

  render() {
    const { children, file, content, style, className } = this.props;

    return (
      <div
        className={
          "react-download-container" + (className ? " " + className : "")
        }
        onClick={() => this.downloadFile(file, content)}
        style={style}
      >
        {children}
      </div>
    );
  }
}
