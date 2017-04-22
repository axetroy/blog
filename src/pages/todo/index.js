/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'antd';

class About extends Component {
  render() {
    return (
      <Row style={{ padding: '2.4rem' }}>
        <Col
          lg={{ span: 14 }}
          md={{ span: 16 }}
          sm={{ span: 20 }}
          xs={{ span: 22 }}
        >
          TODO content
        </Col>
      </Row>
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
)(About);
