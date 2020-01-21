import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // @ts-ignore
    window.ga("set", {
      page: location.pathname,
      title: document.title
    });
  }, [location.pathname, location.search, location.hash]);

  return <div id="ga-analytics" style={{ display: "none" }} />;
}
