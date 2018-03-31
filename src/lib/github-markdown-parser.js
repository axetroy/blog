/**
 * Created by axetroy on 17-4-10.
 */

import github from "./github";

export default (async function(owner, repo, raw, mode = "markdown") {
  let html = "";
  try {
    const response = await github.post(
      "/markdown",
      {
        text: raw,
        mode,
        context: owner + "/" + repo
      },
      { responseType: "text" }
    );
    html = response.data;
  } catch (err) {
    console.error(err);
  }
  return html;
});
