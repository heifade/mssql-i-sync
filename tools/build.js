const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

function changeServerFile(serverFileName) {
  const content = readFileSync(serverFileName, { encoding: "utf8" });
  writeFileSync(serverFileName, `#!/usr/bin/env node\n${content}`);
}
changeServerFile(resolve(__dirname, "../dist/index.js"));




copyFileIfNotExists(resolve(__dirname, "../config.json"), resolve(__dirname, "../dist/config.json"));

function copyFileIfNotExists(source, target) {
  if (!existsSync(target)) {
    copyFileSync(source, target);
  }
}
