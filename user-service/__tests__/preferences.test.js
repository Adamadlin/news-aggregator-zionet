

const request = require('supertest');
const app = require('../index'); // Adjust path if needed

describe('User Preferences API', () => {
  it('should update user preferences', async () => {
    // ✅ Step 1: Register the user first
    await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        preferences: ['tech'],
      });

    // ✅ Step 2: Now update preferences
    const res = await request(app)
      .put('/users/email/test@example.com/preferences')
      .send({ preferences: ['technology', 'sports'] });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Preferences updated/i);
    expect(res.body.user.preferences).toEqual(['technology', 'sports']);
  });
});