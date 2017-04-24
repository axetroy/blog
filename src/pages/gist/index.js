/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tooltip, Icon } from 'antd';

import github from '../../lib/github';
import * as gistAction from '../../redux/gist';

function values(obj) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]]);
    }
  }
  return result;
}

class Gist extends Component {
  state = {};

  async componentWillMount() {
    let { id } = this.props.match.params;
    if (id) {
      await this.getGist(id);
    }
  }

  async componentWillReceiveProps(nextProp) {
    const { id } = nextProp.match.params;
    if (id && id !== this.props.match.params.id) {
      await this.getGist(nextProp.match.params.id);
    }
  }

  async getGist(id) {
    let gist = {};
    try {
      const { data } = await github.get(`/gists/${id}`, {
        headers: {
          Accept: 'application/vnd.github.v3.html'
        },
        responseType: 'text'
      });
      gist = data;

      for (let filename in gist.files) {
        const file = gist.files[filename];
        const res = await github.post(
          '/markdown',
          {
            text: '```' + file.language + '\n' + file.content + '\n```',
            mode: 'markdown'
          },
          { responseType: 'text' }
        );
        file.html = res.data;
      }
    } catch (err) {
      console.error(err);
    }
    this.props.setGist({ [id]: gist });
    return gist;
  }

  render() {
    const { id } = this.props.match.params;
    const gist = (this.props.GIST || {})[id] || {};
    return (
      <Spin spinning={!Object.keys(gist).length}>
        <div className="edit-this-page-container" style={{ padding: '2.4rem' }}>
          <div className="edit-this-page">
            <Tooltip placement="topLeft" title="编辑此页" arrowPointAtCenter>
              <a
                href={`https://gist.github.com/${gist.owner ? gist.owner.login : ''}/${gist.id}/edit`}
                target="_blank"
              >
                <Icon
                  type="edit"
                  style={{
                    fontSize: '3rem'
                  }}
                />
              </a>
            </Tooltip>
          </div>
          {(values(gist.files) || []).map(file => {
            return (
              <div key={file.filename} style={{}}>
                <h3><Icon type="file" />{file.filename}</h3>
                <div
                  className="markdown-body"
                  style={{
                    fontSize: '1.6rem'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: file.html
                  }}
                />
              </div>
            );
          })}
        </div>

      </Spin>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return {
      GIST: state.GIST
    };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setGist: gistAction.set
      },
      dispatch
    );
  }
)(Gist);
