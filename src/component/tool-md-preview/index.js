/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Input, Tabs } from 'antd';

import github from '../../lib/github';
import { setHTML, setMarkdown } from '../../redux/tool-md-preview';

const TabPane = Tabs.TabPane;

class MdPreview extends Component {
  state = {};

  onSourceChange(event) {
    const { value } = event.target;
    this.props.storeMd(value);
  }

  async onTabChange(tab) {
    let html = '';
    if (tab === 'preview') {
      const { data } = await github.post(
        '/markdown',
        {
          text: this.props.TOOL_MD_PREVIEW.markdown,
          mode: 'markdown'
        },
        { responseType: 'text' }
      );
      this.props.storeHTML(data);
    }
    return html;
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <Tabs
            defaultActiveKey="source"
            onChange={tab => this.onTabChange(tab)}
          >
            <TabPane tab="Markdown" key="source">
              <Input
                defaultValue={this.props.TOOL_MD_PREVIEW.markdown}
                style={{ fontSize: '1.4rem' }}
                type="textarea"
                placeholder="Write the markdown here and preview with Github style"
                autosize={{ minRows: 15, maxRows: 40 }}
                onChange={event => this.onSourceChange(event)}
              />
            </TabPane>
            <TabPane tab="Preview" key="preview">
              <div
                className="markdown-body"
                style={{ fontSize: '1.6rem', minHeight: '20rem' }}
                dangerouslySetInnerHTML={{
                  __html: this.props.TOOL_MD_PREVIEW.html + ''
                }}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { TOOL_MD_PREVIEW: state.TOOL_MD_PREVIEW };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        storeHTML: setHTML,
        storeMd: setMarkdown
      },
      dispatch
    );
  }
)(MdPreview);
