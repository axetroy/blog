const fs = require("fs");
const path = require("path");
const Walker = require("@axetroy/walk");

const walker = new Walker("./build");

walker.on("file", function(filepath, stat) {
  const ext = path.extname(filepath);
  if (ext === ".map") {
    fs.unlink(filepath, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log(`remove: ${filepath}`);
      }
    });
  }
});

walker.walk();
