/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin } from 'antd';

class GithubRepositories extends Component {
  state = {};

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async componentWillMount() {}

  render() {
    return (
      <Spin spinning={this.state.followingsLoading}>
        Repositories
      </Spin>
    );
  }
}

export default GithubRepositories;
