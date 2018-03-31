/**
 * Created by axetroy on 17-5-20.
 */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

export default function RouterListener(ComponsedComponent) {
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
        return <ComponsedComponent {...this.props} {...this.state} />;
      }
    }
  );
}
