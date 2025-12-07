const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { log, getLogFilePath } = require('./logger');

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
    version: VERSION
  };

  res.json(info);
});

app.get('/logs', (req, res) => {
  const logPath = getLogFilePath();

  if (!fs.existsSync(logPath)) {
    return res.status(200).json({ message: 'No hay logs todavía' });
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  const lastLines = lines.slice(-20);

  res.json({
    lines: lastLines,
    totalLines: lines.length
  });
});

app.get('/fs-test', (req, res) => {
  const tmpDir = path.join(__dirname, '..', 'logs');
  const tmpFile = path.join(tmpDir, `fs-test-${Date.now()}.txt`);

  fs.writeFileSync(tmpFile, `Archivo creado a las ${new Date().toISOString()}`);
  log(`Archivo temporal creado: ${tmpFile}`);

  res.json({
    message: 'Archivo temporal creado',
    file: tmpFile
  });
});

module.exports = app;
