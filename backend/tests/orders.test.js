const request = require('supertest');
const express = require('express');
const orderRoutes = require('../src/routes/orders');

// Mock middlewares
jest.mock('../src/middleware/auth', () => ({
  auth: (req, res, next) => {
    req.user = { _id: 'user123', role: 'user' };
    next();
  },
  adminAuth: (req, res, next) => {
    req.user = { _id: 'admin123', role: 'admin' };
    next();
  }
}));

// Mock Email Utility
jest.mock('../src/utils/sendEmail', () => jest.fn().mockResolvedValue(true));

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

jest.mock('../src/models/Order', () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockResolvedValue([{ id: 'order1' }, { id: 'order2' }]),
  findById: jest.fn(),
  create: jest.fn().mockResolvedValue({ id: 'newOrder', orderNumber: 'ORD-TEST', status: 'pending' }),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

const Order = require('../src/models/Order');

describe('Orders API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orders', () => {
    it('should fetch orders specific to the logged-in user', async () => {
      const response = await request(app).get('/api/orders');
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(Order.find).toHaveBeenCalledWith({ userId: 'user123' });
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const newOrderPayload = { items: [], totalAmount: 100 };
      
      const response = await request(app)
        .post('/api/orders')
        .send(newOrderPayload);
        
      expect(response.statusCode).toBe(201);
      expect(response.body.orderNumber).toBe('ORD-TEST');
      expect(Order.create).toHaveBeenCalled();
    });
  });
});
