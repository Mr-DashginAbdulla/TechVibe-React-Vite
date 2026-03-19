const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock external dependencies
jest.mock('../src/config/firebase-admin', () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'testuid', email: 'test@example.com', email_verified: true })
  })
}));

jest.mock('../src/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('../src/middleware/auth', () => ({
  auth: (req, res, next) => {
    req.user = { _id: 'user123', role: 'user' };
    next();
  }
}));

const User = require('../src/models/User');

describe('Auth API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/check-email', () => {
    it('should return exists: true if email exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });
      
      const response = await request(app)
        .post('/api/auth/check-email')
        .send({ email: 'test@example.com' });
        
      expect(response.statusCode).toBe(200);
      expect(response.body.exists).toBe(true);
    });

    it('should return exists: false if email does not exist', async () => {
      User.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/auth/check-email')
        .send({ email: 'new@example.com' });
        
      expect(response.statusCode).toBe(200);
      expect(response.body.exists).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user information', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBe('user123');
    });
  });
});
