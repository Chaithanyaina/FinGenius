// server/src/api/routes/auth.test.ts

import request from 'supertest';
import express from 'express';
import authRoutes from './authRoutes';

// --- FIX 1: Mock all controller functions used by the route ---
jest.mock('../controllers/authController', () => ({
  registerUser: jest.fn((req, res) => res.status(201).json({ message: 'User registered' })),
  loginUser: jest.fn((req, res) => res.status(200).json({ token: 'mockToken' })),
  // Add the missing mock for getUserProfile
  getUserProfile: jest.fn((req, res) => res.status(200).json({ id: '123', username: 'testuser' })),
}));

// --- FIX 2: Mock the 'protect' middleware ---
// This tells Jest to replace the real middleware with a simple function
// that just calls next() to proceed to the controller.
jest.mock('../middlewares/authMiddleware', () => ({
    protect: jest.fn((req, res, next) => next()),
}));


const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

describe('Auth Routes', () => {
  it('should respond with 201 on a successful registration', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered');
  });

  // --- ADDED: A test for the profile route to make the suite more robust ---
  it('should respond with 200 when getting a user profile', async () => {
    const response = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', 'Bearer mocktoken'); // Even though it's mocked, it's good practice to send the header

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });
});
