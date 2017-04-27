/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

import github from '../../lib/github';
import * as gistsAction from '../../redux/gists';

class Gists extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 50,
      total: 0
    }
  };
  async componentDidMount() {
    await this.getGistList();
  }

  async getGistList() {
    let gists = [];
    try {
      const { data } = await github.get('/users/axetroy/gists');
      gists = gists.concat(data || []);
    } catch (err) {
      console.error(err);
    }
    this.props.setGists(gists);
    return gists;
  }

  render() {
    return (
      <div>
        <Menu
          mode="inline"
          style={{ overflowY: 'auto', overflowX: 'hidden', borderRight: 0 }}
        >
          {this.props.GISTS.map(gist => {
            return (
              <Menu.Item
                key={gist.id}
                style={{
                  borderBottom: '1px solid #e6e6e6'
                }}
              >
                <NavLink
                  exact={true}
                  to={`/gist/${gist.id}`}
                  style={{
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-all',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {gist.description}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { GISTS: state.GISTS };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setGists: gistsAction.set
      },
      dispatch
    );
  }
)(Gists);
