const { spawn } = require('child_process');
const fs = require('fs');
const child = spawn('node', ['src/server.js']);
let out = '';
child.stdout.on('data', data => out += data.toString());
child.stderr.on('data', data => out += data.toString());
child.on('error', err => out += err.toString());
setTimeout(() => {
  fs.writeFileSync('server_output.txt', out);
  child.kill();
  process.exit(0);
}, 4000);
