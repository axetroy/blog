/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { withRouter } from "react-router-dom";
import { Spin, Tooltip, Icon } from "antd";
import CONFIG from "../../config.json";
import github from "../../lib/github";
import actions from "../../redux/actions";

import DocumentTitle from "../../component/document-title";
import ViewSourceCode from "../../component/view-source-code";

class About extends Component {
  componentDidMount() {
    const { owner, repo } = CONFIG;
    this.getAbout(owner, repo);
  }

  async getAbout(owner, repo) {
    let html = "";
    try {
      const response = await github.get(
        `/repos/${owner}/${repo}/contents/ABOUTME.md`,
        {
          headers: {
            Accept: "application/vnd.github.v3.html"
          },
          responseType: "text"
        }
      );
      html = response.data;
    } catch (err) {
      console.error(err);
    }
    this.props.updateAboutMe(html);
    return html;
  }

  render() {
    return (
      <DocumentTitle title={["关于我"]}>
        <Spin spinning={!this.props.ABOUTME}>
          <div className="toolbar-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
                <a
                  href={`https://github.com/${CONFIG.owner}/${
                    CONFIG.repo
                  }/edit/master/ABOUTME.md`}
                  target="_blank"
                >
                  <Icon
                    type="edit"
                    style={{
                      fontSize: "3rem"
                    }}
                  />
                </a>
              </Tooltip>
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/about/index.js">
                  <a href="javascript: void 0" target="_blank">
                    <Icon
                      type="code"
                      style={{
                        fontSize: "3rem"
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: this.props.ABOUTME
              }}
            />
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(state => ({ ABOUTME: state.ABOUTME }), actions)(
  withRouter(About)
);
