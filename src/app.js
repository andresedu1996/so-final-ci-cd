const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { log, getLogFilePath, getLogDir } = require('./logger');

const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const VERSION = process.env.VERSION || '1.0.0';

app.use((req, res, next) => {
  log(`Request ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.get('/', (req, res) => {
  const info = {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    hostname: os.hostname(),
    nodeVersion: process.version,
    nodeEnv: NODE_ENV,
    version: VERSION,
    message: 'Servicio en linea'
  };

  res.json(info);
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
