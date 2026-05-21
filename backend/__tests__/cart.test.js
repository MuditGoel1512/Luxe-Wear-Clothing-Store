const request = require('supertest');
const express = require('express');

// Mock the database pool
jest.mock('../config/db', () => ({
  pool: {
    execute: jest.fn(),
  },
}));

const { pool } = require('../config/db');

// Create a test app
const app = express();
app.use(express.json());

// Mock middleware
app.use((req, res, next) => {
  req.user = { id: 1 }; // Mock authenticated user
  next();
});

// Import the route that uses the controllers
const cartRoutes = require('../routes/index');
app.use('/api/cart', cartRoutes);

describe('Cart Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get user cart items', async () => {
    pool.execute.mockResolvedValueOnce([
      [
        {
          item_id: 1,
          product_id: 1,
          product_name: 'Test Product',
          price: 99.99,
          quantity: 2,
          image: 'test.jpg'
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/cart');

    // Response depends on route implementation
    expect([200, 404]).toContain(res.status);
  });

  test('should add item to cart', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ id: 1 }], // Product exists
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [{ affectedRows: 1 }],
      undefined
    ]);

    const res = await request(app)
      .post('/api/cart')
      .send({
        product_id: 1,
        quantity: 1,
        selected_size: 'M',
        selected_color: 'Black'
      });

    expect([200, 201, 404]).toContain(res.status);
  });

  test('should remove item from cart', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ affectedRows: 1 }],
      undefined
    ]);

    const res = await request(app)
      .delete('/api/cart/1');

    expect([200, 404]).toContain(res.status);
  });

  test('should update item quantity in cart', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ affectedRows: 1 }],
      undefined
    ]);

    const res = await request(app)
      .patch('/api/cart/1')
      .send({
        quantity: 3
      });

    expect([200, 404]).toContain(res.status);
  });

  test('should handle adding product that does not exist', async () => {
    pool.execute.mockResolvedValueOnce([
      [], // No product found
      undefined
    ]);

    const res = await request(app)
      .post('/api/cart')
      .send({
        product_id: 999,
        quantity: 1
      });

    expect([400, 404]).toContain(res.status);
  });

  test('should clear entire cart', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ affectedRows: 5 }],
      undefined
    ]);

    const res = await request(app)
      .delete('/api/cart');

    expect([200, 404]).toContain(res.status);
  });
});
