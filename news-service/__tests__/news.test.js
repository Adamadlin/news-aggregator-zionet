const request = require('supertest');
const axios = require('axios');

jest.mock('axios');

const app = require('../index');

describe('news-service API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /news returns health message', async () => {
    const res = await request(app).get('/news');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/working/i);
  });

  it('POST /news/fetch-by-preferences returns 400 if preferences missing', async () => {
    const res = await request(app).post('/news/fetch-by-preferences').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/preferences/i);
  });

  it('POST /news/fetch-by-preferences returns 200 and data when axios succeeds', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { title: 'A', link: 'http://a.com' },
          { title: 'B', link: 'http://b.com' },
        ],
      },
    });

    const res = await request(app)
      .post('/news/fetch-by-preferences')
      .send({ preferences: ['tech', 'sports'] });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/fetched successfully/i);
    expect(res.body.data.results).toHaveLength(2);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('POST /news/fetch-by-preferences returns 500 if axios fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('boom'));

    const res = await request(app)
      .post('/news/fetch-by-preferences')
      .send({ preferences: ['tech'] });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/failed to fetch news/i);
  });
});