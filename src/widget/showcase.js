/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Menu, Icon, Tooltip, Tag } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import Octicon from "react-octicon";

import github from "../lib/github";
import { parseShowcase } from "../lib/utils";
import CONFIG from "../config.json";
import actions from "../redux/actions";
import "./showcase.css";

class Showcase extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
      total: 0
    },
    showcaseList: []
  };
  componentDidMount() {
    this.getShowcase();
  }

  componentDidCatch(err) {
    console.error(err);
  }

  async getShowcase(page = 1, per_page = 100) {
    const { data } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: "showcase",
      filter: "created",
      per_page,
      page,
      client_id: CONFIG.github_client_id,
      client_secret: CONFIG.github_client_secret
    });
    this.props.updateShowCases(data.map(v => parseShowcase(v)));
  }

  render() {
    return (
      <div className="widget widget-showcase">
        <div style={{ padding: "0 2.4rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "3rem" }}>
            <Octicon name="gist" mega style={{ fontSize: "3rem" }} />案例展示
          </h2>
        </div>

        <ul className="showcase-list">
          {this.props.SHOW_CASES.concat(this.state.showcaseList).map(
            showcase => {
              return (
                <li key={showcase.id} className="showcase-item">
                  <h3>
                    {showcase.homepage ? (
                      <a href={showcase.homepage} target="_blank">
                        {showcase.title}
                      </a>
                    ) : (
                      showcase.title
                    )}
                  </h3>
                  <div>
                    {showcase.description.split("\n").map(line => {
                      return <p key={line}>{line}</p>;
                    })}
                  </div>
                  <div>
                    {(showcase.labels || []).map(label => {
                      return (
                        <Tag
                          key={label.id}
                          color={"#" + label.color}
                          style={{ margin: "0.5rem 0.2rem" }}
                        >
                          {label.name}
                        </Tag>
                      );
                    })}
                  </div>
                </li>
              );
            }
          )}
          {this.state.hashNextpage ? (
            <li className="more" onClick={() => this.getNextGistList()}>
              More
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    );
  }
}
export default connect(state => ({ SHOW_CASES: state.SHOW_CASES }), actions)(
  withRouter(Showcase)
);
