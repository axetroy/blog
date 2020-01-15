import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

function GoogleAnalytics(props) {
  const { location } = props;

  useEffect(() => {
    // @ts-ignore
    window.ga("set", {
      page: location.pathname,
      title: document.title
    });
  }, [location.pathname, location.search, location.hash]);

  return <div id="ga-analytics" style={{ display: "none" }} />;
}

export default withRouter(GoogleAnalytics);
