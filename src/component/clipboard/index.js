/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component, PropTypes } from 'react';
import Clipboard from 'clipboard';

class ClipboardComponent extends Component {
  PropTypes = {
    value: PropTypes.string,
    onSuccess: PropTypes.func,
    onError: PropTypes.func
  };
  componentWillUnmount() {
    this.__Clipboard && this.__Clipboard.destroy();
  }

  render() {
    return (
      <span
        ref={dom => {
          if (dom && !this.__Clipboard) {
            let clipboard = (this.__Clipboard = new Clipboard(dom, {
              text: () => {
                return this.props.value;
              }
            }));

            clipboard.on('success', event => {
              if (typeof this.props.onSuccess) {
                this.props.onSuccess(event);
              }
            });

            clipboard.on('error', event => {
              if (typeof this.props.onError) {
                this.props.onError(event);
              }
            });
          }
        }}
      >
        {this.props.children}
      </span>
    );
  }
}
export default ClipboardComponent;
