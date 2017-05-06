/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component, PropTypes } from 'react';

class DocumentTitle extends Component {
  constructor(props) {
    super(props);
    this.root = `Axetroy's NeverLand`;
  }
  PropTypes = {
    title: PropTypes.string,
    suffix: PropTypes.string
  };

  componentWillMount() {
    if (!this.__originTitle) this.__originTitle = document.title;
    const { title, suffix } = this.props;
    if (title) {
      this.setTitle(title, suffix);
    }
  }

  componentWillReceiveProps(nextPros) {
    const { title, suffix } = nextPros;
    if (title) {
      this.setTitle(title, suffix);
    }
  }

  componentWillUnmount() {
    // recover the title before set
    if (this.__originTitle) document.title = this.__originTitle;
  }

  setTitle(title, suffix) {
    document.title =
      title +
      (suffix ? ' | ' + suffix.join('|') + ' ' : '') +
      ` | Axetroy's NeverLand`;
    return this;
  }

  render() {
    return this.props.children || '';
  }
}
export default DocumentTitle;
