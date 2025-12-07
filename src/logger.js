const fs = require('fs');
const path = require('path');
const os = require('os');

// Choose a writable directory even on read-only filesystems (e.g. Vercel).
const candidateDirs = [
  process.env.LOG_DIR,
  path.join(__dirname, '..', 'logs'),
  path.join(os.tmpdir(), 'so-final-ci-cd-logs')
].filter(Boolean);

let resolvedLogDir = null;

function ensureLogDir() {
  if (resolvedLogDir && fs.existsSync(resolvedLogDir)) {
    return resolvedLogDir;
  }

  for (const dir of candidateDirs) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      resolvedLogDir = dir;
      return dir;
    } catch (err) {
      // Ignore and try next candidate; console helps debugging in serverless.
      console.error(`Cannot use log dir ${dir}: ${err.message}`);
    }
  }

  return null;
}

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  const dir = ensureLogDir();

  if (dir) {
    const file = path.join(dir, 'app.log');
    try {
      fs.appendFileSync(file, line);
      return;
    } catch (err) {
      console.error(`Failed to write log file: ${err.message}`);
    }
  }

  console.log(line.trim());
}

function getLogDir() {
  return ensureLogDir();
}

function getLogFilePath() {
  const dir = ensureLogDir();
  return dir ? path.join(dir, 'app.log') : null;
}

module.exports = { log, getLogFilePath, getLogDir };
