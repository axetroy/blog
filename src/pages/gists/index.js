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
import graphql from '../../lib/graphql';
import * as gistsAction from '../../redux/gists';

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
      const { data } = await github.get('/users/axetroy/gists', {
        params: { page, per_page }
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
    this.props.setGists(gists);
    return gists;
  }

  async getList(endCursor) {
    try {
      const { data } = await graphql(`
query{
  viewer{
    gists(first:${this.state.meta.per_page} ${
        endCursor ? 'after:' + '"' + endCursor + '"' : ''
      }){
      totalCount
      nodes{
        name description id
      }
      pageInfo{
        hasNextPage endCursor
      }
    }
  }
}
      `)();
      const gists = data.data.viewer.gists.nodes;
      this.props.setGists(gists);
    } catch (err) {}
  }

  render() {
    return (
      <DocumentTitle title={['Gist List']}>
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
          <div style={{ padding: '0 2.4rem' }}>
            <h2 style={{ textAlign: 'center' }}>代码片段</h2>
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
