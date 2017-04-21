/**
 * Created by axetroy on 17-4-21.
 */
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
export default class FullHeight extends Component {
  constructor() {
    super();
    const handler = debounce(this.onresize.bind(this), 100);
    window.addEventListener('resize', handler, false);
  }
  state = {
    clientHeight: this.calcHeight()
  };

  onresize() {
    this.setState({ clientHeight: this.calcHeight() });
  }

  calcHeight() {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  render() {
    return (
      <div style={{ height: this.state.clientHeight }} className="full-height">
        {this.props.children}
      </div>
    );
  }
}
