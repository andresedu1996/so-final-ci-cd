const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { log, getLogFilePath, getLogDir } = require('./logger');

const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const VERSION = process.env.VERSION || '1.0.0';

function buildStatus() {
  const logDir = getLogDir();
  const logPath = getLogFilePath();

  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    hostname: os.hostname(),
    nodeVersion: process.version,
    nodeEnv: NODE_ENV,
    version: VERSION,
    logDir,
    logPath,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  };
}

function renderStatusHtml(status) {
  const isLive = true;
  const logStatus = status.logDir ? 'Writable' : 'Unavailable';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SO Final CI/CD Status</title>
  <style>
    :root {
      --bg: #0f172a;
      --panel: #111827;
      --card: #1f2937;
      --text: #e5e7eb;
      --muted: #9ca3af;
      --accent: #34d399;
      --accent-2: #60a5fa;
      --warn: #f59e0b;
      --danger: #ef4444;
      --shadow: 0 20px 60px rgba(0,0,0,0.35);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.08), transparent 25%),
                  radial-gradient(circle at 80% 0%, rgba(96, 165, 250, 0.1), transparent 28%),
                  var(--bg);
      color: var(--text);
      padding: 24px;
    }
    .shell {
      max-width: 980px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    header {
      background: var(--panel);
      padding: 18px 20px;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      padding: 8px 14px;
      font-weight: 600;
      background: rgba(52, 211, 153, 0.14);
      color: var(--accent);
      border: 1px solid rgba(52, 211, 153, 0.35);
    }
    .pill dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--accent);
      display: inline-block;
      box-shadow: 0 0 12px rgba(52, 211, 153, 0.8);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
    }
    .card {
      background: var(--card);
      border-radius: 16px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.06);
      box-shadow: var(--shadow);
    }
    .card h3 {
      margin: 0 0 8px 0;
      font-size: 15px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .value {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }
    .muted { color: var(--muted); }
    .link {
      color: var(--accent-2);
      text-decoration: none;
      font-weight: 600;
    }
    .link:hover { text-decoration: underline; }
    footer {
      text-align: center;
      color: var(--muted);
      font-size: 13px;
      padding: 10px 0 24px;
    }
    @media (max-width: 640px) {
      body { padding: 16px; }
      header { flex-direction: column; align-items: flex-start; }
      .title { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header>
      <div>
        <div class="title">SO Final CI/CD Status</div>
        <div class="muted">Live monitoring for Vercel deployment</div>
      </div>
      <div class="pill"><dot></dot>${isLive ? ' Live' : ' Offline'}</div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>Environment</h3>
        <div class="value">${status.nodeEnv}</div>
        <div class="muted">Node ${status.nodeVersion}</div>
      </div>
      <div class="card">
        <h3>Version</h3>
        <div class="value">${status.version}</div>
        <div class="muted">Hostname: ${status.hostname}</div>
      </div>
      <div class="card">
        <h3>Runtime</h3>
        <div class="value">${status.platform} / ${status.arch}</div>
        <div class="muted">${status.cpus} CPUs • Uptime ${status.uptimeSeconds}s</div>
      </div>
      <div class="card">
        <h3>Logging</h3>
        <div class="value">${logStatus}</div>
        <div class="muted">${status.logPath || 'No log file detected'}</div>
      </div>
      <div class="card">
        <h3>Tests</h3>
        <div class="value">CI-managed</div>
        <div class="muted">See GitHub Actions badge in README</div>
      </div>
      <div class="card">
        <h3>API</h3>
        <div class="value"><a class="link" href="/status">/status JSON</a></div>
        <div class="muted"><a class="link" href="/logs">/logs</a> • <a class="link" href="/fs-test">/fs-test</a></div>
      </div>
    </div>

    <div class="card" style="width:100%;">
      <h3>Timestamps</h3>
      <div class="value">${status.timestamp}</div>
      <div class="muted">Live ping via Express on Vercel</div>
    </div>

    <footer>
      Built for CI/CD demo • If something looks off, check /status and logs.
    </footer>
  </div>
</body>
</html>`;
}

app.use((req, res, next) => {
  log(`Request ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.get('/', (req, res) => {
  const status = buildStatus();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderStatusHtml(status));
});

app.get('/status', (req, res) => {
  const status = buildStatus();
  res.json(status);
});

app.get('/logs', (req, res) => {
  const logPath = getLogFilePath();

  if (!logPath) {
    return res.status(200).json({ message: 'Logging is not available in this environment' });
  }

  if (!fs.existsSync(logPath)) {
    return res.status(200).json({ message: 'No hay logs todavia' });
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const trimmed = content.trim();
  const lines = trimmed ? trimmed.split('\n') : [];
  const lastLines = lines.slice(-20);

  res.json({
    lines: lastLines,
    totalLines: lines.length
  });
});

app.get('/fs-test', (req, res) => {
  const tmpDir = getLogDir();

  if (!tmpDir) {
    return res.status(500).json({ message: 'No writable directory available for temp files' });
  }

  const tmpFile = path.join(tmpDir, `fs-test-${Date.now()}.txt`);

  try {
    fs.writeFileSync(tmpFile, `Archivo creado a las ${new Date().toISOString()}`);
    log(`Archivo temporal creado: ${tmpFile}`);
  } catch (err) {
    return res.status(500).json({
      message: 'Could not create temp file',
      error: err.message,
      dir: tmpDir
    });
  }

  res.json({
    message: 'Archivo temporal creado',
    file: tmpFile
  });
});

module.exports = app;
