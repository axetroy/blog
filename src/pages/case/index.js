/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Spin, Tooltip, Icon, Col, Row } from 'antd';

import DocumentTitle from '../../component/document-title';
import ViewSourceCode from '../../component/view-source-code';

class Case extends Component {
  state = {
    case: [
      {
        name: '中菁商城',
        desc: `
        中菁商城是一个以生物产品为主导的在线P2P商城，提供生物/基因产品和技术服务.
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '光彩钱包',
        desc: `
        光彩钱包是一个以虚拟币钱包，管理虚拟币的运营/走向和资金流动
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '光彩交易平台',
        desc: `
        光彩交易平台是一个以虚拟币为主导的流通/投资平台
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '象宝交易平台',
        desc: `
        象宝交易平台是一个以虚拟币为主导的流通/投资平台，与光彩交易平台类似
`,
        screenshot: '',
        homepage: ``
      }
    ],
    baby: [
      {
        name: '虚拟币交易平台v3',
        desc: `
        名字待定，乃虚拟币交易平台第三版. 前端基于Angular@2构建，后因种种原因，开发途中死于胎腹.
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '旅游向导类微信小程序',
        desc: `
        关于旅游向导类微信小程序，后因种种原因，开发途中死于胎腹.
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: 'OA系统APP',
        desc: `
        办公类的app，主体是android java和ios object-c. 部分内容嵌套webview，后因种种原因，开发途中死于胎腹.
`,
        screenshot: '',
        homepage: ``
      },
      {
        name: '烤好吃微信小程序',
        desc: `
        一个实体店点餐/外卖的小程序，后因种种原因，开发途中死于胎腹.
`,
        screenshot: '',
        homepage: ``
      }
    ]
  };
  render() {
    return (
      <DocumentTitle title="关于我">
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
            <div>
              <h2 style={{ textAlign: 'center' }}>成年项目</h2>
              <Row gutter={16}>
                {this.state.case.map(c => {
                  return (
                    <Col
                      md={8}
                      xs={24}
                      key={c.name}
                      style={{ margin: '1rem 0' }}
                    >
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={c.screenshot || 'img/no-img.jpg'}
                          alt="案例截图"
                          style={{ width: '100%', height: 'auto' }}
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
                          <h3>{c.name}</h3>
                          <p>{c.desc}</p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div>
              <h2 style={{ textAlign: 'center' }}>怀孕期项目</h2>
              <Row gutter={16}>
                {this.state.baby.map(c => {
                  return (
                    <Col
                      xs={24}
                      md={8}
                      key={c.name}
                      style={{ margin: '1rem 0' }}
                    >
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={c.screenshot || 'img/no-img.jpg'}
                          alt="案例截图"
                          style={{ width: '100%', height: 'auto' }}
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
                          <h3>{c.name}</h3>
                          <p>{c.desc}</p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        </Spin>
      </DocumentTitle>
    );
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
