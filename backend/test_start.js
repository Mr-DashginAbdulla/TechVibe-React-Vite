const fs = require('fs');
process.on('uncaughtException', (err) => {
  fs.writeFileSync('error.txt', err.stack || err.toString());
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  fs.writeFileSync('error.txt', reason.stack || reason.toString());
  process.exit(1);
});
try {
  require('./src/server');
} catch (e) {
  fs.writeFileSync('error.txt', e.stack || e.toString());
}
