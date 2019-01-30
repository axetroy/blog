/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Button } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import Octicon from "react-octicon";

import github from "../lib/github";
import CONFIG from "../config.json";
import actions from "../redux/actions";
import "./gist.css";

class Gists extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 10,
      total: 0
    },
    gistList: [],
    hashNextpage: false
  };
  componentDidMount() {
    const { page, per_page } = this.state.meta;
    this.getGistList(page, per_page).then(gistList => {
      this.setState({
        gistList,
        hashNextpage: gistList.length > 0 && gistList.length >= per_page
      });
    });
  }

  componentDidCatch(err) {
    console.error(err);
  }

  async getAllGistList(page, per_page, gists = []) {
    const { data } = await github.gists.listPublicForUser({
      username: CONFIG.owner,
      page,
      per_page,
      client_id: CONFIG.github_client_id,
      client_secret: CONFIG.github_client_secret
    });
    gists = gists.concat(data || []);
    return gists;
  }

  async getGistList(page, per_page) {
    this.setState({ loading: true });
    const gists = await this.getAllGistList(page, per_page);
    this.setState({
      loading: false,
      hashNextpage: gists.length > 0 && gists.length >= per_page
    });
    return gists;
  }

  async getNextGistList() {
    const { page, per_page } = this.state.meta;
    const nextPage = page + 1;
    const nextGistList = await this.getGistList(nextPage, per_page);
    if (nextGistList.length) {
      const hash = {};
      const newGistList = this.state.gistList.concat(nextGistList).filter(v => {
        if (!hash[v.id]) {
          hash[v.id] = true;
          return true;
        } else {
          return false;
        }
      });
      this.setState({
        meta: {
          ...this.state.meta,
          page: nextPage
        },
        gistList: newGistList
      });
    }
  }

  render() {
    return (
      <div className="widget widget-gist">
        <div>
          <h2>
            <NavLink to="/gist">
              <Octicon name="gist" mega />
              <span className="middle">Gist</span>
            </NavLink>
          </h2>
        </div>
        <ul className="gist-list">
          {this.state.gistList.map(gist => {
            return (
              <li key={gist.id} className="gist-item">
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
                  {gist.description}
                </NavLink>
              </li>
            );
          })}
          {this.state.hashNextpage ? (
            <li className="more">
              <Button
                type="default"
                loading={this.state.loading}
                onClick={() => this.getNextGistList()}
              >
                {this.state.loading ? "Loading" : "More"}
              </Button>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    );
  }
}
export default connect(state => ({}), actions)(withRouter(Gists));
