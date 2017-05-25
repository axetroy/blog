/**
 * Created by axetroy on 17-5-25.
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

const KEY = 'REACT_APP_PUBLISH_DATE';

const raw = fs.readFileSync(envPath, { encoding: 'utf8' });

const data = raw
  .split(/\n+/)
  .filter(v => v)
  .map(v => v.trim())
  .map(v => {
    let arr = v.split('=');
    let key = arr.shift();
    let value = arr.join('=');

    if (KEY === key) {
      return '';
    } else {
      return key + '=' + value;
    }
  })
  .filter(v => v)
  .concat([`REACT_APP_PUBLISH_DATE=${new Date().getTime()}`])
  .map(v => v.trim())
  .join('\n\n');

fs.writeFileSync(envPath, data);
