/**
 * Created by axetroy on 17-5-22.
 */
import React, { Component } from "react";
import PropTypes from "proptypes";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";

class DynamicLoad extends Component {
  static PropTypes = {
    promise: PropTypes.isPrototypeOf(Promise).isRequire
  };

  state = {
    loading: true,
    component: ""
  };

  componentWillMount() {
    const { promise } = this.props;
    this.load(promise);
  }
  componentWillReceiveProps(nextProps) {
    const { promise } = nextProps;
    this.load(promise);
  }
  load(promise) {
    if (promise && typeof promise.then === "function") {
      const id = Math.random();
      this.__id__ = id;
      this.setState({ loading: true });
      promise
        .then(module => {
          // 防止多个promise请求组件, 不知道应该渲染哪个组件
          let DynamicComponent = module.default;
          if (id === this.__id__) {
            this.setState({ component: <DynamicComponent />, loading: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false });
          this.props.history.goBack();
          console.error(err);
        });
    }
  }
  render() {
    const isLoading = this.state.loading;
    return (
      <div
        style={
          isLoading
            ? {
                width: "100%",
                height: "100%",
                minHeight: "20rem",
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "0.4rem",
                zIndex: 99999999
              }
            : {}
        }
      >
        <Spin
          spinning={isLoading}
          style={isLoading ? { marginTop: "4rem" } : {}}
        >
          <div style={{ textAlign: "left" }}>{this.state.component}</div>
        </Spin>
      </div>
    );
  }
}

export default withRouter(DynamicLoad);
