/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Spin, Tooltip, Icon, Col, Row, Card } from 'antd';
import Lightbox from 'react-image-lightbox';
import LazyLoad from 'react-lazyload';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';

function img(name) {
  return `img/showcase/${name}`;
}

class Case extends Component {
  state = {
    shouldRend: false,
    lightboxImages: [],
    photoIndex: 0,
    isOpen: false,

    done: [
      {
        name: '个人博客',
        desc: `博客从最初的wordpress，再到hexo，然后到现在自己写的react实现。总要有个地方记录些什么东西...`,
        screenshot: [1, 2, 3].map(i => img(`blog-${i}.png`)),
        homepage: `https://axetroy.github.io`
      },
      {
        name: '中菁商城',
        desc: `以生物产品为主导的在线P2P商城，提供生物/基因产品和技术服务.`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '光彩钱包',
        desc: `虚拟币钱包，管理虚拟币的运营/走向和资金流动`,
        screenshot: [1].map(i => img(`gcb-wallet-${i}.png`)),
        homepage: ``
      },
      {
        name: '光彩交易平台',
        desc: `以虚拟币为主导的流通/投资平台`,
        screenshot: [1, 2, 3].map(i => img(`gcb-${i}.png`)),
        homepage: ``
      },
      {
        name: 'K币交易平台',
        desc: `以虚拟币为主导的流通/投资平台`,
        screenshot: [1, 2].map(i => img(`kcoin-${i}.png`)),
        homepage: `http://kcoin.biz`
      },
      {
        name: '象宝交易平台',
        desc: `以虚拟币为主导的流通/投资平台`,
        screenshot: [1, 2, 3].map(i => img(`dob-${i}.png`)),
        homepage: ``
      },
      {
        name: '全球币交易平台',
        desc: `以虚拟币为主导的流通/投资平台`,
        screenshot: [1, 2].map(i => img(`woqi-${i}.png`)),
        homepage: ``
      },
      {
        name: 'KAO好吃后台管理',
        desc: `KAO好吃微信公众号后台管理`,
        screenshot: [1, 2, 3].map(i => img(`kaopu-${i}.png`)),
        homepage: `http://cy.hydhmy.com/hyc/m/per.html`
      },
      {
        name: 'KAO好吃微信小程序',
        desc: `一个实体店点餐/外卖的小程序.`,
        screenshot: [1, 2, 3].map(i => img(`wxapp-kaopu-${i}.png`)),
        homepage: ``
      }
    ],
    undone: [
      {
        name: '虚拟币交易平台v3',
        desc: `
        名字待定，乃虚拟币交易平台第三版. 前端基于Angular@2构建.
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '旅游向导类微信小程序',
        desc: `类似嗨牛旅行`,
        screenshot: [1, 2].map(i => img(`tuanjian-${i}.png`)),
        homepage: ``
      },
      {
        name: 'OA系统APP',
        desc: `办公类的app，主体是android java和ios object-c. 部分内容嵌套webview`,
        screenshot: '',
        homepage: ``
      }
    ]
  };

  componentWillMount() {
    const location = this.props.location;
    if (
      window.__IS_ADMIN__ === true ||
      location.search.indexOf('viewer=admin') >= 0
    ) {
      window.__IS_ADMIN__ = true;
      this.setState({ shouldRend: true });
    } else {
      this.props.history.goBack();
    }
  }

  rendCase(title, cases) {
    const noScreenshotImg = 'img/no-img.jpg';
    return (
      <LazyLoad height={300} offset={100}>
        <div>
          <h2 style={{ textAlign: 'center' }}>{title}</h2>
          <Row gutter={16}>
            {cases.map(c => {
              return (
                <Col md={8} xs={24} key={c.name} style={{ margin: '1rem 0' }}>
                  <Card>
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '30rem'
                      }}
                    >
                      <div
                        style={{
                          backgroundImage: `url(${c.screenshot &&
                            c.screenshot.length
                            ? c.screenshot[0]
                            : noScreenshotImg})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          backgroundAttachment: 'interit',
                          verticalAlign: 'middle',
                          width: '100%',
                          height: '30rem'
                        }}
                        onClick={() =>
                          this.setState({
                            isOpen: true,
                            photoIndex: 0,
                            lightboxImages: c.screenshot && c.screenshot.length
                              ? c.screenshot
                              : [noScreenshotImg]
                          })}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          backgroundColor: '#FAFAFA',
                          padding: '1rem',
                          width: '100%'
                        }}
                      >
                        <h3>
                          {c.homepage
                            ? <a href={c.homepage} target="_blank">{c.name}</a>
                            : c.name}
                        </h3>
                        <p>{c.desc}</p>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </LazyLoad>
    );
  }

  render() {
    let images = ['blog-1.png', 'blog-2.png', 'blog-3.png'].map(v => img(v));
    const { photoIndex, isOpen, lightboxImages, shouldRend } = this.state;
    return shouldRend
      ? <DocumentTitle title={['案例展示']}>
          <Spin spinning={false}>
            <div className="toolbar-container">
              <div className="edit-this-page">
                <Tooltip placement="topLeft" title="查看源码" arrowPointAtCenter>
                  <ViewSourceCode file="pages/case/index.js">
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
              {this.rendCase('顺产项目', this.state.done)}
              {this.rendCase('难产项目', this.state.undone)}
              {isOpen
                ? <Lightbox
                    mainSrc={lightboxImages[photoIndex]}
                    nextSrc={
                      lightboxImages[(photoIndex + 1) % lightboxImages.length]
                    }
                    prevSrc={
                      lightboxImages[
                        (photoIndex + images.length - 1) % lightboxImages.length
                      ]
                    }
                    onCloseRequest={() =>
                      this.setState({ isOpen: false, photoIndex: 0 })}
                    onMovePrevRequest={() =>
                      this.setState({
                        photoIndex:
                          (photoIndex + lightboxImages.length - 1) %
                            lightboxImages.length
                      })}
                    onMoveNextRequest={() =>
                      this.setState({
                        photoIndex: (photoIndex + 1) % lightboxImages.length
                      })}
                  />
                : null}
            </div>
          </Spin>
        </DocumentTitle>
      : <div />;
  }
}
export default connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
  }
)(withRouter(Case));
