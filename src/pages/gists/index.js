/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Icon, Tooltip } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import Octicon from 'react-octicon';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';
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
      <DocumentTitle title="Gist List">
        <div className="toolbar-container">
          <div className="edit-this-page">
            <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
              <ViewSourceCode file="pages/gists/index.js">
                <a href="javascript: void 0" target="_blank">
                  <Icon
                    type="code"
                    style={{
                      fontSize: '3rem'
                    }}
                  />
                </a>
              </ViewSourceCode>
            </Tooltip>
          </div>
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
                    <Octicon
                      style={{ fontSize: '1.6rem', marginRight: '0.5rem' }}
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
)(withRouter(Gists));
