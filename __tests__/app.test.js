const request = require('supertest');
const fs = require('fs');
const app = require('../src/app');

describe('SO Final CI/CD App', () => {
  test('GET /status debe devolver info del sistema en JSON', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('platform');
    expect(res.body).toHaveProperty('nodeEnv');
    expect(res.body).toHaveProperty('version');
  });

  test('GET / devuelve HTML con dashboard', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('SO Final CI/CD Status');
  });

  test('GET /fs-test crea un archivo temporal', async () => {
    const res = await request(app).get('/fs-test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('file');
    const filePath = res.body.file;
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('GET /logs devuelve logs (aunque sea mensaje vacio)', async () => {
    await request(app).get('/status');

    const res = await request(app).get('/logs');
    expect(res.statusCode).toBe(200);
  });
});
