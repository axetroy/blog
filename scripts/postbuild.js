const fs = require('fs-extra');
const path = require('path');

const domain = "axetroy.xyz"

const cnamePath = path.join(__dirname, "..", "build", "CNAME")

fs.ensureFileSync(cnamePath);

fs.writeFileSync(cnamePath, domain)