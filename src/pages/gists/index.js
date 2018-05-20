/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Menu } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import Octicon from "react-octicon";

import DocumentTitle from "../../component/document-title";
import github from "../../lib/github";
import CONFIG from "../../config.json";

import actions from "../../redux/actions";

class Gists extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 100,

      total: 0
    }
  };
  async componentDidMount() {
    const { page, per_page } = this.state.meta;
    await this.getGistList(page, per_page);
  }

  async getAllGistList(page, per_page, gists = []) {
    try {
      const { data } = await github.gists.getForUser({
        username: CONFIG.owner,
        page,
        per_page,
        client_id: CONFIG.github_client_id,
        client_secret: CONFIG.github_client_secret
      });
      gists = gists.concat(data || []);
      // 如果往后还有下一页，则继续请求，直到完为止
      if (data.length > 0 && data.length >= per_page) {
        gists = await this.getAllGistList(page + 1, per_page, gists);
      }
    } catch (err) {
      console.error(err);
    }
    return gists;
  }

  async getGistList(page, per_page) {
    const gists = await this.getAllGistList(page, per_page);
    this.props.updateGistList(gists);
    return gists;
  }

  render() {
    return (
      <DocumentTitle title={["代码片段"]}>
        <div>
          <div style={{ padding: "2.4rem" }}>
            <h2 style={{ textAlign: "center" }}>代码片段</h2>
          </div>
          <Menu
            mode="inline"
            style={{ overflowY: "auto", overflowX: "hidden", borderRight: 0 }}
          >
            {this.props.GISTS.map(gist => {
              return (
                <Menu.Item
                  key={gist.id}
                  style={{
                    borderBottom: "1px solid #e6e6e6"
                  }}
                >
                  <NavLink
                    exact={true}
                    to={`/gist/${gist.id}`}
                    style={{
                      whiteSpace: "nowrap",
                      wordBreak: "break-all",
                      textOverflow: "ellipsis",
                      overflow: "hidden"
                    }}
                  >
                    <Octicon
                      style={{ fontSize: "1.6rem", marginRight: "0.5rem" }}
                      name="gist"
                      mega
                    />
                    {gist.description}
                  </NavLink>
                </Menu.Item>
              );
            })}
          </Menu>
        </div>
      </DocumentTitle>
    );
  }
}
export default connect(state => ({ GISTS: state.GISTS }), actions)(
  withRouter(Gists)
);
