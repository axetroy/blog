/**
 * Created by axetroy on 17-5-22.
 */
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom';

class DynamicLoad extends Component {

  static PropTypes = {
    promise: PropTypes.isPrototypeOf(Promise)
  };

  state = {
    component: ''
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
    if (promise && typeof promise.then === 'function') {
      const id = Math.random();
      this.__id__ = id;
      promise
        .then(module => {
          // 防止多个promise请求组件, 不知道应该渲染哪个组件
          let DynamicComponent = module.default;
          if (id === this.__id__) {
            this.setState({ component: <DynamicComponent /> });
          }
        })
        .catch(err => {
          this.props.history.goBack();
          console.error(err);
        });
    }
  }
  render() {
    return this.state.component || <div />;
  }
}

export default withRouter(DynamicLoad);
