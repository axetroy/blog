/**
 * Created by axetroy on 17-5-20.
 */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class GoogleAnalytics extends Component {
  componentWillReceiveProps(nextProp) {
    if (
      this.props.location.pathname !== nextProp.location.pathname ||
      this.props.location.search !== nextProp.location.search ||
      this.props.location.hash !== nextProp.location.hash
    ) {
      // 如果路由发生变化, 则提交给 Google
      this.submit(nextProp.location);
      window.scrollTo(0, 0);
    }
  }
  componentDidMount() {
    this.submit(this.props.location);
  }
  submit(location) {
    window.ga("set", {
      page: location.pathname,
      title: document.title
    });
  }
  render() {
    return <div style={{ display: "none" }} />;
  }
}

export default withRouter(GoogleAnalytics);
