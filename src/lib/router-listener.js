/**
 * Created by axetroy on 17-5-20.
 */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

/**
 * 监听路由变化，主要是用来进行url统计
 * @export
 * @param {any} ComposedComponent
 * @returns
 */
export default function RouterListener(ComposedComponent) {
  return withRouter(
    class extends Component {
      constructor(props) {
        super(props);
        this.listeners = [];
      }
      componentWillUnmount() {
        this.listeners.forEach(
          listener => typeof listener === "function" && listener()
        );
      }
      componentDidMount() {
        const { history, onRouterChange } = this.props;
        if (history && typeof onRouterChange === "function") {
          const listener = history.listen(onRouterChange);
          this.listeners.push(listener);
        }
      }

      render() {
        return <ComposedComponent {...this.props} {...this.state} />;
      }
    }
  );
}
