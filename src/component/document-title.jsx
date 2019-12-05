/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

class DocumentTitle extends Component {
  static propTypes = {
    title: PropTypes.array,
    revert: PropTypes.bool
  };

  UNSAFE_componentWillMount() {
    // store origin title
    this.__originTitle = document.title;
    const { title, suffix, root } = this.props;
    if (title) {
      this.setTitle(title, suffix, root);
    }
  }

  UNSAFE_componentWillReceiveProps(nextPros) {
    const { title, suffix, root } = nextPros;
    if (title) {
      this.setTitle(title, suffix, root);
    }
  }

  componentWillUnmount() {
    // recover the title before set
    if (this.props.revert === true) {
      document.title = this.__originTitle;
    }
  }

  setTitle(title) {
    document.title = title.join(" | ");
    return this;
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default class extends Component {
  PropTypes = {
    title: PropTypes.array,
    revert: PropTypes.bool
  };
  render() {
    let title = (this.props.title || []).concat([`Axetroy's NeverLand`]);
    const props = {
      ...this.props,
      ...{ title }
    };
    return <DocumentTitle {...props} />;
  }
}
