import React, { Component, PropTypes } from 'react';

export default class GithubCalendar extends Component {
  PropTypes = {
    name: PropTypes.string
  };
  render() {
    return (
      <div
        className={
          'calendar' + (this.props.className ? ' ' + this.props.className : '')
        }
        {...this.props}
        ref={dom => {
          const GitHubCalendar = require('github-calendar');
          GitHubCalendar(dom, this.props.name);
        }}
      />
    );
  }
}
