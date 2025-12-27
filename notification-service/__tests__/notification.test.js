const request = require('supertest');

// Mock axios (backend + news-service calls)
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock nodemailer so it never sends real emails
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(async () => ({ accepted: ['test@example.com'], messageId: 'mock-id' })),
  })),
}));

const axios = require('axios');
const app = require('../index');

describe('notification-service API', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.SMTP_USER = 'fake@example.com';
    process.env.SMTP_PASS = 'fake-pass';
  });

  it('GET /notifications returns health message', async () => {
    const res = await request(app).get('/notifications');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/working/i);
  });

  it('POST /notify returns 400 if email missing', async () => {
    const res = await request(app).post('/notify').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  it('POST /notify returns 400 if user has no preferences', async () => {
    axios.get.mockResolvedValueOnce({ data: { email: 'a@a.com', preferences: [] } });

    const res = await request(app).post('/notify').send({ email: 'a@a.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/no preferences/i);
  });

  it('POST /notify sends email based on DB preferences + news results', async () => {
    // 1) backend returns user with preferences
    axios.get.mockResolvedValueOnce({
      data: { email: 'test@example.com', preferences: ['tech', 'sports'] },
    });

    // 2) news-service returns articles
    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            { title: 'Article 1', link: 'http://a1.com' },
            { title: 'Article 2', link: 'http://a2.com' },
          ],
        },
      },
    });

    const res = await request(app).post('/notify').send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Email sent/i);

    // sanity: correct service calls happened
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('POST /notify returns 200 with "No news found" when results empty', async () => {
    axios.get.mockResolvedValueOnce({
      data: { email: 'test@example.com', preferences: ['tech'] },
    });

    axios.post.mockResolvedValueOnce({
      data: { data: { results: [] } },
    });

    const res = await request(app).post('/notify').send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/No news/i);
  });
});