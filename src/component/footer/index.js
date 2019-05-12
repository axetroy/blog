/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import Now from "@axetroy/react-now";
import { distanceInWordsToNow } from "date-fns";
import chinese from "date-fns/locale/zh_cn";
import { Row, Col } from "antd";

import { diffTime } from "../../lib/utils";
import "./index.css";

class Footer extends Component {
  state = {
    created: new Date("2016-11-09 14:22:33")
  };

  render() {
    const LAST_UPDATE_TIME = new Date(+process.env.REACT_APP_PUBLISH_DATE);
    return (
      <footer>
        <Row id="footer">
          <Col
            xs={{ span: 11, offset: 1 }}
            sm={{ span: 5, offset: 1 }}
            md={{ span: 4, offset: 4 }}
            lg={{ span: 4, offset: 4 }}
            xl={{ span: 4, offset: 4 }}
            xxl={{ span: 4, offset: 4 }}
          >
            <p className="footer-item-name">相关链接</p>
            <ul>
              <li>
                <a
                  href="https://github.com/axetroy"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/axetroy/blog"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  网站源码
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/axetroy?utf8=%E2%9C%93&tab=repositories&q=vscode&type=source&language="
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  我的 vscode 扩展
                </a>
              </li>
            </ul>
          </Col>
          <Col
            xs={{ span: 11 }}
            sm={{ span: 5 }}
            md={{ span: 4 }}
            lg={{ span: 4 }}
            xl={{ span: 4 }}
            xxl={{ span: 4 }}
          >
            <p className="footer-item-name">免费的API服务</p>
            <ul>
              <li>
                <a
                  href="https://github.com/axetroy/ip"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  获取当前IP
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/axetroy/locate"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  根据IP获取定位信息
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/axetroy/proxy"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  HTTP请求代理
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/axetroy/email"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  发送邮件
                </a>
              </li>
            </ul>
          </Col>
          <Col
            xs={{ span: 11, offset: 1 }}
            sm={{ span: 5 }}
            md={{ span: 4 }}
            lg={{ span: 4 }}
            xl={{ span: 4 }}
            xxl={{ span: 4 }}
          >
            <p className="footer-item-name">友情链接</p>
            <ul>
              <li>
                { /* eslint-disable-next-line */ }
                <a
                  href="javascript: void 0;" 
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  留言加个友链可好?
                </a>
              </li>
            </ul>
          </Col>
          <Col
            xs={{ span: 11 }}
            sm={{ span: 5 }}
            md={{ span: 4 }}
            lg={{ span: 4 }}
            xl={{ span: 4 }}
            xxl={{ span: 4 }}
          >
            <p className="footer-item-name">关于本站</p>
            <ul>
              <li>Copyright © {new Date().getFullYear()}</li>
              <li>
                <Now>
                  {now => {
                    const diff = diffTime(this.state.created)(now);
                    return (
                      <div>
                        <p>
                          {`已运行
                  ${diff.days}天
                  ${diff.hours}时
                  ${diff.minutes}分
                  ${diff.seconds}秒
                  `}
                        </p>
                        <p>
                          最近更新于&nbsp;
                          {distanceInWordsToNow(LAST_UPDATE_TIME, {
                            locale: chinese
                          })}
                          前
                        </p>
                      </div>
                    );
                  }}
                </Now>
              </li>
              <li>
                Created by{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/axetroy"
                >
                  Axetroy
                </a>
              </li>
              <li>
                <a
                  href="https://analytics.google.com/analytics/web/?hl=zh-CN&pli=1#report/defaultid/a98287100w144548599p149233935/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  站长统计
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </footer>
    );
  }
}
export default Footer;
