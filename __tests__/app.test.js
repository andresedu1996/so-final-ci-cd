const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const { getLogFilePath } = require('../src/logger');

describe('SO Final CI/CD App', () => {
  test('GET / debe devolver info del sistema', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('platform');
    expect(res.body).toHaveProperty('nodeEnv');
    expect(res.body).toHaveProperty('version');
  });

  test('GET /fs-test crea un archivo temporal', async () => {
    const res = await request(app).get('/fs-test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('file');
    const filePath = res.body.file;
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('GET /logs devuelve logs (aunque sea mensaje vacío)', async () => {
    await request(app).get('/');

    const res = await request(app).get('/logs');
    expect(res.statusCode).toBe(200);
  });
});
