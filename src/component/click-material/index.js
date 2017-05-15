/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';

import './index.css';

class Click extends Component {
  componentWillMount() {
    const width = 200;
    const height = 200;
    const ele = document.createElement('span');
    ele.classList.add('ripple');
    ele.style.width = `${width}px`;
    ele.style.height = `${height}px`;
    this.__ele__ = ele;
  }
  componentWillUnmount() {
    (this.__timer__ || []).forEach(timerId => {
      clearTimeout(timerId);
    });
  }
  onClick(event) {
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
      <div onClick={this.onClick.bind(this)} ref="container">
        {this.props.children}
      </div>
    );
  }
}
export default Click;
