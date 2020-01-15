import { Button } from "antd";
import React, { useState, useEffect } from "react";
import Octicon from "react-octicon";
import { NavLink } from "react-router-dom";
import CONFIG from "../config.json";
import github from "../lib/github";
import "./gist.css";

export default function Gists() {
  const [meta, setMeta] = useState({ page: 1, per_page: 10, total: 0 });
  const [gistList, setGistList] = useState([]);
  const [hashNextpage, setHashNextpage] = useState(false);
  const [loading, setLoading] = useState(false);

  const controller = new AbortController();

  useEffect(() => {
    const { page, per_page } = meta;
    getGistList(page, per_page)
      .then(list => {
        setGistList(list);
        setHashNextpage(list.length > 0 && list.length >= per_page);
      })
      .catch(() => {});

    return function() {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getGistList(page, per_page) {
    setLoading(true);
    const { data: gists } = await github.gists.listPublicForUser({
      username: CONFIG.owner,
      page,
      per_page,
      request: {
        signal: controller.signal
      }
    });
    setLoading(false);
    setHashNextpage(gists.length > 0 && gists.length >= per_page);
    return gists;
  }

  async function getNextGistList() {
    const { page, per_page } = meta;
    const nextPage = page + 1;
    const nextGistList = await getGistList(nextPage, per_page);
    if (nextGistList.length) {
      const hash = {};
      const newGistList = gistList.concat(nextGistList).filter(v => {
        if (!hash[v.id]) {
          hash[v.id] = true;
          return true;
        } else {
          return false;
        }
      });

      setGistList(newGistList);
      setMeta({
        ...meta,
        page: nextPage
      });
    }
  }

  return (
    <div className="widget widget-gist">
      <div className="widget-header">
        <h3>
          <NavLink to="/gist">
            <Octicon name="gist" mega />
            <span className="middle">Gist</span>
          </NavLink>
        </h3>
      </div>
      <ul className="gist-list">
        {gistList.map(gist => {
          return (
            <li key={gist.id} className="gist-item">
              <NavLink
                exact={true}
                to={`/gist/${gist.id}`}
                style={{
                  whiteSpace: "nowrap",
                  wordBreak: "break-all",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}
              >
                {gist.description}
              </NavLink>
            </li>
          );
        })}
        {hashNextpage ? (
          <li className="more">
            <Button
              type="default"
              loading={loading}
              onClick={() => getNextGistList()}
            >
              {loading ? "Loading" : "More"}
            </Button>
          </li>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
}
