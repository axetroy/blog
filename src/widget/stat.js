/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { withRouter } from "react-router-dom";
import Octicon from "react-octicon";
import { formatDistanceToNow } from "date-fns";
import chinese from "date-fns/locale/zh-CN";
import { Tooltip } from "antd";

import github from "../lib/github";
import actions from "../redux/actions";
import CONFIG from "../config.json";
import "./stat.css";

const domain = "https://github.com/";

function repoUrl(name) {
  return domain + name;
}

function issueUrl(name, number) {
  return domain + name + "/issues/" + number;
}

const eventMap = {
  IssuesEvent(event) {
    const { name } = event.repo;
    const { action, issue } = event.payload;
    switch (action) {
      case "assigned":
        return;
      case "unassigned":
        return;
      case "labeled":
        return "";
      case "unlabeled":
        return;
      case "opened":
        return (
          <span>
            <span className="green">
              创建
              <Octicon name="issue-closed" mega />
            </span>
            <a
              href={issueUrl(name, issue.number)}
              target="_blink"
              rel="noopener noreferrer"
            >
              {name}#{issue.number}
            </a>
          </span>
        );
      case "edited":
        return;
      case "milestoned":
        return;
      case "demilestoned":
        return;
      case "closed":
        return (
          <span>
            <span className="red">
              关闭
              <Octicon name="issue-closed" mega />
            </span>
            <a
              href={issueUrl(name, issue.number)}
              target="_blink"
              rel="noopener noreferrer"
            >
              {name}#{issue.number}
            </a>
          </span>
        );
      case "reopened":
        return;
      default:
        break;
    }
  },
  IssueCommentEvent(event) {
    const { name } = event.repo;
    const { action, issue } = event.payload;
    switch (action) {
      case "created":
        return (
          <span>
            在
            <a
              href={issueUrl(name, issue.number)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}(#{issue.number})
            </a>
            中留下评论
          </span>
        );
      case "updated":
        return (
          <span>
            更新
            <a
              href={issueUrl(name, issue.number)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}(#{issue.number})
            </a>
            中的评论
          </span>
        );
      case "deleted":
        return (
          <span>
            删除
            <a
              href={issueUrl(name, issue.number)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}(#{issue.number})
            </a>
            中的评论
          </span>
        );
      default:
      //
    }
  },
  CreateEvent(event) {
    const { name } = event.repo || {};
    const { ref_type, ref } = event.payload;
    switch (ref_type) {
      case "tag":
        return (
          <span>
            发布
            <a href={repoUrl(name)} target="_blink">
              {name}
            </a>
            <Octicon name="tag" mega />
            {ref}
          </span>
        );
      case "repository":
        return (
          <span>
            创建
            <Octicon name="repo" mega />
            <a href={repoUrl(name)} target="_blink">
              {name}
            </a>
          </span>
        );
      case "branch":
        return (
          <span>
            创建
            <a href={repoUrl(name)} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
            <Octicon name="git-branch" mega />
            {ref}
          </span>
        );
      default:
      //
    }
  },
  PushEvent(event) {
    const { name } = event.repo || {};
    const { size, ref } = event.payload;
    const branch = ref.replace("refs/heads/", "");
    return (
      <span>
        提交 <b>{size}</b> 个commit到
        <a
          href={repoUrl(name) + "/tree/" + branch}
          target="_blink"
          rel="noopener noreferrer"
        >
          {name}
          <Octicon name="git-branch" mega />
          {branch}
        </a>
      </span>
    );
  },
  WatchEvent(event) {
    const { name } = event.repo || {};
    const { action } = event.payload;
    switch (action) {
      case "started":
        return (
          <span>
            点赞
            <Octicon name="thumbsup" mega />
            <a href={repoUrl(name)} rel="noopener noreferrer" target="_blank">
              {name}
            </a>
          </span>
        );
      default:
    }
  },
  ForkEvent(event) {
    const { name } = event.repo || {};
    const { forkee } = event.payload;
    return (
      <span>
        <Octicon name="repo-forked" mega />
        <a href={repoUrl(name)} target="_blank" rel="noopener noreferrer">
          {name}
        </a>{" "}
        派生{" "}
        <a
          href={repoUrl(forkee.full_name)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {forkee.full_name}
        </a>
      </span>
    );
  },
  PullRequestEvent(event) {
    const { name } = event.repo;
    const { action, number } = event.payload;
    switch (action) {
      case "opened":
        return (
          <span>
            发起PR
            <Octicon name="git-pull-request" mega />
            <a
              href={repoUrl(name) + "/pull/" + number}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}#{number}
            </a>
          </span>
        );
      case "closed":
        return (
          <span>
            关闭PR
            <Octicon name="git-pull-request" mega />
            <a
              href={repoUrl(name) + "/pull/" + number}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}#{number}
            </a>
          </span>
        );
      case "reopened":
        return (
          <span>
            重新开启PR
            <Octicon name="git-pull-request" mega />
            <a
              href={repoUrl(name) + "/pull/" + number}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}#{number}
            </a>
          </span>
        );
      default:
      //
    }
  }
};

class Stat extends Component {
  state = {
    events: [],
    latestEvent: {}
  };
  async componentDidMount() {
    this.getAllRepo().then(repositories => {
      this.props.updateRepositories(repositories);
    });
    this.getAllFollower().then(followers => {
      this.props.updateFollowers(followers);
    });
    const res = await github.activity.listPublicEventsForUser({
      username: CONFIG.owner,
      per_page: 20,
      page: 0
    });

    const events = res.data;

    this.setState({ latestEvent: events[0] });

    const eventElements = [];
    for (const event of events) {
      if (event.type in eventMap) {
        eventElements.push(
          <Tooltip
            placement="top"
            title={
              formatDistanceToNow(event.created_at, { locale: chinese }) + "前"
            }
          >
            {eventMap[event.type](event)}
          </Tooltip>
        );
      }
    }
    this.setState({
      events: eventElements
    });
  }

  async getAllRepo(page = 1, per_page = 100) {
    const { data } = await github.repos.listForUser({
      username: CONFIG.owner,
      page,
      per_page
    });
    // 说明还有下一页数据
    if (data.length >= per_page) {
      return data.concat(await this.getAllRepo(page + 1));
    }
    return data;
  }

  async getAllFollower(page = 1, per_page = 100) {
    const { data } = await github.users.listFollowersForUser({
      username: CONFIG.owner,
      page,
      per_page
    });
    // 说明还有下一页数据
    if (data.length >= per_page) {
      return data.concat(await this.getAllFollower(page + 1));
    }
    return data;
  }

  componentDidCatch(err) {
    console.error(err);
  }

  render() {
    return (
      <div className="widget widget-stat">
        <div className="widget-header">
          <h3>
            <a
              href={`https://github.com/${CONFIG.owner}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Octicon name="mark-github" mega />
              <span className="middle">Github</span>
            </a>
          </h3>
        </div>
        <div className="stat-meta">
          <p>
            开源 <b>{this.props.REPOS.filter(v => !v.fork).length}</b>{" "}
            个原创项目 , 有 <b>{this.props.FOLLOWERS.length}</b> 个人关注我
          </p>
          <p>
            收获{" "}
            <b>
              {this.props.REPOS.map(repo => repo.stargazers_count || 0).reduce(
                (a, b) => a + b,
                0
              ) || 0}
            </b>{" "}
            个 Star,{" "}
            <b>
              {this.props.REPOS.map(repo => repo.forks_count || 0).reduce(
                (a, b) => a + b,
                0
              ) || 0}
            </b>{" "}
            个 Fork.
          </p>
          {/* <p>
            累计参与贡献过 <b>233</b> 个开源项目
          </p> */}
          <p>
            最近活动：
            <b>
              {this.state.events.length && this.state.latestEvent
                ? formatDistanceToNow(this.state.latestEvent.created_at, {
                    locale: chinese
                  }) + "前"
                : ""}
            </b>
          </p>
          <ul className="event-list">
            {this.state.events
              .filter(v => v)
              .slice(0, 10)
              .map((v, i) => {
                return <li key={i}>{v}</li>;
              })}
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({
    GISTS: state.GISTS,
    REPOS: state.REPOS,
    FOLLOWERS: state.FOLLOWERS
  }),
  actions
)(withRouter(Stat));
