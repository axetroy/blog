/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Tag } from "antd";
import { withRouter } from "react-router-dom";
import Octicon from "react-octicon";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import github from "../lib/github";
import { parseShowcase } from "../lib/utils";
import CONFIG from "../config.json";
import actions from "../redux/actions";
import "./showcase.css";

class Showcase extends Component {
  state = {
    meta: {
      page: 1,
      per_page: 100,
      total: 0
    },
    showcaseList: [],
    photoIndex: 0,
    isOpen: false,
    gallery: [],
    title: ""
  };
  componentDidMount() {
    this.getShowcase(this.state.meta.page, this.state.meta.per_page);
  }

  componentDidCatch(err) {
    console.error(err);
  }

  async getShowcase(page = 1, per_page) {
    const { data } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: "showcase",
      creator: CONFIG.owner,
      per_page,
      page,
      client_id: CONFIG.github_client_id,
      client_secret: CONFIG.github_client_secret
    });
    this.props.updateShowCases(data.map(v => parseShowcase(v)));
  }

  count(label) {
    let count = 0;
    this.props.SHOW_CASES.forEach(v => {
      const labels = v.labels || [];
      if (labels.findIndex(v => v.name === label.toLowerCase()) >= 0) {
        count = count + 1;
      }
    });
    return count;
  }

  render() {
    const { photoIndex, isOpen, gallery, title } = this.state;
    const images = gallery.map(v => v.url);
    const currentImage = gallery[photoIndex];
    return (
      <div className="widget widget-showcase">
        <div style={{ padding: "0 2.4rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "3rem" }}>
            <Octicon name="gist" mega style={{ fontSize: "3rem" }} />
            <span className="middle">Project</span>
          </h2>
        </div>
        <div style={{ margin: "5px 10px" }}>
          <p>
            总共做过<b>{this.props.SHOW_CASES.length}</b>个项目，其中
            <b>{this.count("前端")}</b>个前端项目，<b>{this.count("后端")}</b>
            后端项目，顺产了<b>{this.count("顺产")}</b>个项目, 难产了
            <b>{this.count("难产")}</b>个项目
          </p>
        </div>
        <ul className="showcase-list">
          {this.props.SHOW_CASES.concat(this.state.showcaseList).map(
            showcase => {
              return (
                <li key={showcase.id} className="showcase-item">
                  <h3>
                    {showcase.homepage ? (
                      <a
                        href={showcase.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          style={{ width: 20, height: 20, marginRight: 10 }}
                          src={`./icon/network.svg`}
                          alt="项目主页"
                          title="打开项目主页"
                        />
                      </a>
                    ) : null}
                    {showcase.gallery.length ? (
                      // eslint-disable-next-line
                      <a
                        // eslint-disable-next-line
                        href="javascript: void 0"
                        onClick={() =>
                          this.setState({
                            isOpen: true,
                            gallery: showcase.gallery,
                            title: showcase.title
                          })
                        }
                      >
                        <span style={{ verticalAlign: "middle" }}>
                          {showcase.title}
                        </span>
                      </a>
                    ) : (
                      showcase.title
                    )}
                  </h3>
                  <div>
                    {showcase.description.split("\n").map((line, index) => {
                      return (
                        <p key={showcase.id + "-" + line + "-" + index}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  <div>
                    {(showcase.labels || []).map(label => {
                      return (
                        <Tag
                          key={showcase.id + "-" + label.id}
                          color={"#" + label.color}
                          style={{ margin: "0.5rem 0.2rem" }}
                        >
                          {label.name}
                        </Tag>
                      );
                    })}
                  </div>
                </li>
              );
            }
          )}
        </ul>
        {isOpen && images.length ? (
          <div>
            <Lightbox
              imageTitle={title}
              imageCaption={currentImage.name || ""}
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}
              onCloseRequest={() =>
                this.setState({ isOpen: false, images: [], photoIndex: 0 })
              }
              onMovePrevRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + images.length - 1) % images.length
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + 1) % images.length
                })
              }
            />
          </div>
        ) : null}
      </div>
    );
  }
}
export default connect(
  state => ({ SHOW_CASES: state.SHOW_CASES }),
  actions
)(withRouter(Showcase));
