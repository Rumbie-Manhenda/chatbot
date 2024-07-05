const request = require('supertest');
const app = require('./server');

describe('Chatbot Server', () => {
  describe('GET /', () => {
    it('should serve the index.html file', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('<html>');
    });
  });

  describe('POST /getChatbotResponse', () => {
    it('should return 400 for invalid user message', async () => {
      const res = await request(app)
        .post('/getChatbotResponse')
        .send({ userMessage: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid user message');
    });

    it('should return a chatbot response for valid user message', async () => {
      const res = await request(app)
        .post('/getChatbotResponse')
        .send({ userMessage: 'Hello' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('chatbotResponse');
    });
  });
});
