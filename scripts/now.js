/**
 * Created by axetroy on 17-5-25.
 */
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

const envPath = path.join(process.cwd(), ".env");

const LAST_COMMIT_HASH = "REACT_APP_LAST_COMMIT_HASH";
const LAST_COMMIT_TREE_HASH = "REACT_APP_LAST_COMMIT_TREE_HASH";
const LAST_COMMIT_AUTHOR = "REACT_APP_LAST_COMMIT_AUTHOR";
const LAST_COMMIT_MESSAGE = "REACT_APP_LAST_COMMIT_MESSAGE";
const LAST_COMMIT_DATE = "REACT_APP_LAST_COMMIT_DATE";

fs.ensureFileSync(envPath);

const raw = fs.readFileSync(envPath, { encoding: "utf8" });

const { hash, treeHash, author, message, date } = getCommitInfo();

const data = raw
  .split(/\n+/)
  .filter(v => v)
  .map(v => v.trim())
  .map(v => {
    const arr = v.split("=");
    const key = arr.shift();
    const value = arr.join("=");

    if (
      LAST_COMMIT_HASH === key ||
      LAST_COMMIT_AUTHOR === key ||
      LAST_COMMIT_MESSAGE === key ||
      LAST_COMMIT_DATE === key ||
      LAST_COMMIT_TREE_HASH === key
    ) {
      return undefined;
    } else {
      return key + "=" + value;
    }
  })
  .filter(v => v)
  .concat([`${LAST_COMMIT_HASH}="${hash}"`])
  .concat([`${LAST_COMMIT_TREE_HASH}="${treeHash}"`])
  .concat([`${LAST_COMMIT_AUTHOR}="${author}"`])
  .concat([`${LAST_COMMIT_MESSAGE}="${message}"`])
  .concat([`${LAST_COMMIT_DATE}="${date}"`])
  .map(v => v.trim())
  .join("\n\n");

fs.writeFileSync(envPath, data);

function getCommitInfo() {
  const buff = execSync('git log -n 1 --pretty=format:"%H%n%h%n%s%n%an%n%ai"');
  const output = buff.toString();

  const arr = output.split("\n");

  const hash = arr[0];
  const treeHash = arr[1];
  const message = arr[2];
  const author = arr[3];
  const date = arr[4];

  return {
    hash,
    treeHash,
    author,
    date,
    message
  };
}
