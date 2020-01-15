import React, { Fragment, useEffect } from "react";

export default function DocumentTitle(props) {
  const { title, children } = props;

  useEffect(() => {
    document.title = (title || []).concat(["Axetroy's NeverLand"]).join(" | ");
  }, [title]);

  return <Fragment>{children}</Fragment>;
}
