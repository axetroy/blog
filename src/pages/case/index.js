/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Spin, Tooltip, Icon, Col, Row, Card, Tag } from 'antd';
import Lightbox from 'react-image-lightbox';
import LazyLoad from 'react-lazyload';
import github from '../../lib/github';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';

import * as showCaseAction from '../../redux/showcases';

/**
 * parse the data
 * @param d
 * @returns {{title, description: string, gallery: Array.<*>}}
 */
function dataParser(d) {
  const body = d.body;

  const lines = body.split('\n');

  let homePageLine = -1;
  let descriptionStartLineNumber = -1;
  let descriptionEndLineNumber = -1;
  let galleryStartLineNumber = -1;
  let galleryEndLineNumber = -1;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line.indexOf(`<!-- homepage-start -->`) >= 0) {
      homePageLine = i + 1;
    } else if (line.indexOf(`<!-- description-start -->`) >= 0) {
      descriptionStartLineNumber = i + 1;
    } else if (line.indexOf(`<!-- description-end -->`) >= 0) {
      descriptionEndLineNumber = i - 1;
    } else if (line.indexOf(`<!-- gallery-start -->`) >= 0) {
      galleryStartLineNumber = i + 1;
    } else if (line.indexOf(`<!-- gallery-end -->`) >= 0) {
      galleryEndLineNumber = i - 1;
    }
  }

  const description = [];
  const gallery = [];
  let homepage = '';

  body.split('\n').forEach((line, i) => {
    if (i === homePageLine) {
      homepage = line.trim();
    } else if (
      i >= descriptionStartLineNumber &&
      i <= descriptionEndLineNumber
    ) {
      description.push(line);
    } else if (i >= galleryStartLineNumber && i <= galleryEndLineNumber) {
      gallery.push(line);
    }
  });

  const _gallery = gallery.map(line => {
    const match = line.trim().match(/\[([^\]]+)\]\(([^\)]+)\)/im);
    if (match) {
      const name = match[1];
      const url = match[2];
      return {
        name,
        url,
      };
    } else {
      return void 0;
    }
  });

  return {
    title: d.title,
    description: description.join('\n'),
    gallery: _gallery.filter(v => v),
    screenshot: _gallery.filter(v => v).map(v => v.url),
    labels: d.labels,
    homepage: homepage,
  };
}

class Case extends Component {
  state = {
    lightboxImages: [],
    photoIndex: 0,
    isOpen: false,
  };

  async componentWillMount() {
    // get case
    try {
      const res = await github.get(`/repos/axetroy/showcase/issues`);
      const data = res.data || [];
      const list = [];

      while (data.length) {
        try {
          const d = data.shift();
          list.push(dataParser(d));
        } catch (err) {
          console.error(err);
        }
      }

      this.props.setShowCases(list);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const noScreenshotImg = 'img/no-img.jpg';
    const { photoIndex, isOpen, lightboxImages } = this.state;
    return (
      <DocumentTitle title={['案例展示']}>
        <Spin spinning={false}>
          <div className="toolbar-container">
            <div className="edit-this-page">
              <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                <ViewSourceCode file="pages/case/index.js">
                  <a
                    href="javascript: void 0"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon
                      type="code"
                      style={{
                        fontSize: '3rem',
                      }}
                    />
                  </a>
                </ViewSourceCode>
              </Tooltip>
            </div>
            <LazyLoad height={300} offset={100}>
              <div>
                <h2 style={{ textAlign: 'center' }}>案例展示</h2>
                <Row gutter={16}>
                  {this.props.SHOW_CASES.map(c => {
                    return (
                      <Col
                        md={8}
                        xs={24}
                        key={c.title}
                        style={{ margin: '1rem 0' }}
                      >
                        <Card>
                          <div
                            style={{
                              position: 'relative',
                              overflow: 'hidden',
                              minHeight: '30rem',
                            }}
                          >
                            <div
                              style={{
                                backgroundImage: `url(${
                                  c.screenshot && c.screenshot.length
                                    ? c.screenshot[0]
                                    : noScreenshotImg
                                })`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundAttachment: 'interit',
                                backgroundPosition: 'center center',
                                verticalAlign: 'middle',
                                width: '100%',
                                height: '30rem',
                              }}
                              onClick={() =>
                                this.setState({
                                  isOpen: true,
                                  photoIndex: 0,
                                  lightboxImages:
                                    c.screenshot && c.screenshot.length
                                      ? c.screenshot
                                      : [noScreenshotImg],
                                })
                              }
                            />
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                backgroundColor: '#FAFAFA',
                                padding: '1rem',
                                width: '100%',
                              }}
                            >
                              <h3>
                                {c.homepage ? (
                                  <a href={c.homepage} target="_blank">
                                    {c.title}
                                  </a>
                                ) : (
                                  c.title
                                )}
                              </h3>
                              <div>
                                {c.description.split('\n').map(line => {
                                  return <p key={line}>{line}</p>;
                                })}
                              </div>
                              <div>
                                {(c.labels || []).map(label => {
                                  return (
                                    <Tag
                                      key={label.id}
                                      color={'#' + label.color}
                                    >
                                      {label.name}
                                    </Tag>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </LazyLoad>
            {isOpen ? (
              <Lightbox
                mainSrc={lightboxImages[photoIndex]}
                nextSrc={
                  lightboxImages[(photoIndex + 1) % lightboxImages.length]
                }
                prevSrc={
                  lightboxImages[
                    (photoIndex + lightboxImages.length - 1) %
                      lightboxImages.length
                  ]
                }
                onCloseRequest={() =>
                  this.setState({ isOpen: false, photoIndex: 0 })
                }
                onMovePrevRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + lightboxImages.length - 1) %
                      lightboxImages.length,
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + 1) % lightboxImages.length,
                  })
                }
              />
            ) : null}
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  function mapStateToProps(state) {
    return { SHOW_CASES: state.SHOW_CASES || [] };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setShowCases: showCaseAction.set,
      },
      dispatch
    );
  }
)(withRouter(Case));
