#!/usr/bin/env node

const [major, minor] = process.versions.node.split('.').map(Number);

if (major < 20 || (major === 20 && minor < 9)) {
  console.error(
    '\x1b[31m[Error] Node.js 20.9.0 or higher is required. Current: ' +
      process.version +
      '\x1b[0m\n' +
      'Please run: nvm use\n'
  );
  process.exit(1);
}
