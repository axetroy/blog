/**
 * Created by axetroy on 17-5-24.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal } from 'antd';

import SourceCode from '../source-code';

class ViewSourceCode extends Component {
  state = {
    visible: false,
  };

  showSourceCode() {
    this.setState({
      visible: true,
    });
  }

  hideSourceCode() {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <span>
        <span onClick={this.showSourceCode.bind(this)}>
          {this.props.children}
        </span>
        <Modal
          width={'80%'}
          visible={this.state.visible}
          footer={null}
          onCancel={this.hideSourceCode.bind(this)}
          onOk={this.hideSourceCode.bind(this)}
          maskClosable={true}
          closable={true}
        >
          <SourceCode file={this.props.file} />
        </Modal>
      </span>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
  }
)(ViewSourceCode);
