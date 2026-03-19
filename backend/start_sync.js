const child_process = require('child_process');
const fs = require('fs');

try {
  // timeout ensures it doesn't hang forever if server starts fine
  const result = child_process.execSync('node src/server.js', { encoding: 'utf-8', stdio: 'pipe', timeout: 5000 });
  fs.writeFileSync('crash.txt', 'Started successfully:\n' + result);
} catch (error) {
  fs.writeFileSync('crash.txt', error.stderr || error.stdout || error.message);
}
