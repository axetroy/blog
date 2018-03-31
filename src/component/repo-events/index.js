/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { Table } from "antd";

import moment from "moment";

import github from "../../lib/github";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: name => (
      <a target="_blank" href={`https://github.com/${name}`}>
        {name}
      </a>
    )
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: date => <span>{date && moment(date).fromNow()}</span>
  }
];

class RepoReadme extends Component {
  state = { events: [], readmeLoading: true };

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async componentWillMount() {
    await this.getEvents(this.props.owner, this.props.repo);
  }

  async getEvents(owner, repo) {
    let events = [];
    try {
      await this.setStateAsync({ eventLoading: true });
      const response = await github.get(`/repos/${owner}/${repo}/events`);
      events = [].concat(response.data);
    } catch (err) {
      console.error(err);
    }
    this.setState({ events, eventLoading: false });
    return events;
  }

  render() {
    return (
      <Table
        pagination={false}
        columns={columns}
        loading={this.state.eventLoading}
        dataSource={this.state.events.map((v, i) => {
          return {
            key: i,
            date: v.created_at,
            name: v.actor.login,
            type: v.type
          };
        })}
      />
    );
  }
}

export default RepoReadme;
