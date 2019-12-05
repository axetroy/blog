import React, { Component } from "react";
import PropTypes from "prop-types";

class Now extends Component {
  static propTypes = {
    interval: PropTypes.number
  };

  state = {
    date: new Date()
  };

  clearInterval() {
    if (this.__interval_id__ !== void 0) {
      clearInterval(this.__interval_id__);
    }
  }

  UNSAFE_componentWillMount() {
    this.__interval_id__ = setInterval(
      this.timer.bind(this),
      this.props.interval || 1000
    );
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  timer() {
    this.setState({ date: new Date() });
  }

  render() {
    let render = this.props.children;

    if (typeof render !== "function" || Array.isArray(render)) {
      this.clearInterval();
      throw new Error(
        `react-now component's child must contain only one function`
      );
    }

    const reactElement = render.call(this, this.state.date);

    if (!React.isValidElement(reactElement)) {
      this.clearInterval();
      throw new Error(`react-now: Function not return a valid react element`);
    }

    return reactElement;
  }
}

export default Now;
