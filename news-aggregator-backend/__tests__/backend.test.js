const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// IMPORTANT: set NODE_ENV before importing the app
process.env.NODE_ENV = 'test';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

const axios = require('axios');
const { app, connectToMongo } = require('../index');

describe('news-aggregator-backend API', () => {
  let mongoServer;

  beforeAll(async () => {
    // give mongo-memory-server a bit more time on some machines
    jest.setTimeout(30000);

    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();

    await connectToMongo();
  });

  beforeEach(async () => {
    // clean DB between tests
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it('POST /users creates a new user', async () => {
    const res = await request(app).post('/users').send({
      name: 'Test',
      email: 'test@example.com',
      age: 20,
      preferences: ['tech'],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.preferences).toEqual(['tech']);
  });

  it('PUT /users/email/:email/preferences updates preferences', async () => {
    await request(app).post('/users').send({
      name: 'Test',
      email: 'test@example.com',
      age: 20,
      preferences: ['tech'],
    });

    const res = await request(app)
      .put('/users/email/test@example.com/preferences')
      .send({ preferences: ['sports', 'business'] });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.preferences).toEqual(['sports', 'business']);
  });

  it('POST /users/fetch-news fetches news based on saved preferences (mocked)', async () => {
    await request(app).post('/users').send({
      name: 'Test',
      email: 'test@example.com',
      age: 20,
      preferences: ['tech'],
    });

    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            { title: 'A', link: 'http://a.com', pubDate: '2025-01-01', source_id: 'x' },
            { title: 'B', link: 'http://b.com', pubDate: '2025-01-02', source_id: 'y' },
          ],
        },
      },
    });

    const res = await request(app).post('/users/fetch-news').send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.articles.length).toBe(2);
    expect(res.body.articles[0]).toMatchObject({ title: 'A', link: 'http://a.com' });
  });

  it('POST /users/fetch-news returns 404 if user not found', async () => {
    const res = await request(app).post('/users/fetch-news').send({ email: 'no@user.com' });
    expect(res.statusCode).toBe(404);
  });
});