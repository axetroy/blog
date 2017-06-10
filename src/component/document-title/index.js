/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component, PropTypes } from 'react';
import DocumentTitle from '@axetroy/react-document-title';

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
