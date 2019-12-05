/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import debounce from "lodash.debounce";

import "./ripple.css";

class Click extends Component {
  state = {
    enable: true
  };
  shouldEnable() {
    if (window.innerWidth <= 576) {
      this.setState({ enable: false });
      return false;
    } else {
      this.setState({ enable: true });
      return true;
    }
  }
  componentDidMount() {
    // 判断是否应该开启特性
    // 移动端关闭特性
    const isItShouldEnable = debounce(this.shouldEnable.bind(this), 200);

    this.__resize__ = isItShouldEnable;
    window.addEventListener("resize", isItShouldEnable);

    isItShouldEnable();

    const width = 200;
    const height = 200;
    const ele = document.createElement("span");
    ele.classList.add("ripple");
    ele.style.width = `${width}px`;
    ele.style.height = `${height}px`;
    this.__ele__ = ele;
  }
  componentWillUnmount() {
    (this.__timer__ || []).forEach(timerId => {
      clearTimeout(timerId);
    });

    if (this.__resize__) {
      window.removeEventListener("resize", this.__resize__);
    }
  }
  onClick(event) {
    if (!this.state.enable) return;

    const { pageX, pageY } = event;
    const width = 200;
    const height = 200;

    if (!this.__ele__) return;

    const ele = this.__ele__.cloneNode(true);
    ele.style.left = `${pageX - width / 2}px`;
    ele.style.top = `${pageY - height / 2}px`;
    this.refs.container.appendChild(ele);

    this.__timer__ = this.__timer__ || [];
    this.__timer__ = this.__timer__.concat([
      setTimeout(() => {
        ele.remove();
      }, 750)
    ]);
  }

  render() {
    return (
      <div
        onClick={this.onClick.bind(this)}
        ref="container"
        style={this.props.style || {}}
      >
        {this.props.children}
      </div>
    );
  }
}
export default Click;
