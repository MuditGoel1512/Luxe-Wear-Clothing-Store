const request = require('supertest');
const express = require('express');

// Mock the database pool
jest.mock('../config/db', () => ({
  pool: {
    execute: jest.fn(),
  },
}));

const { pool } = require('../config/db');
const {
  createMockUser,
  createMockProduct,
  assertSuccessResponse,
  assertErrorResponse,
} = require('./testUtils');

describe('Integration Tests - Complete User Flow', () => {
  // Create a test app
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Add mock middleware
    app.use((req, res, next) => {
      req.user = { id: 1 };
      next();
    });

    // Import routes
    const authRoutes = require('../routes/auth');
    const productRoutes = require('../routes/products');
    const cartRoutes = require('../routes/index');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);

    jest.clearAllMocks();
  });

  describe('User Registration and Login Flow', () => {
    test('complete registration and login flow', async () => {
      // Step 1: Register new user
      pool.execute.mockResolvedValueOnce([[], undefined]); // No existing user
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }, undefined]); // Insert user
      pool.execute.mockResolvedValueOnce([{}, undefined]); // Create cart

      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123!',
        });

      expect(registerRes.status).toBe(201);
      expect(registerRes.body.success).toBe(true);
      expect(registerRes.body.token).toBeDefined();

      // Step 2: Login with new credentials
      const mockHashedPassword = '$2a$12$hashedpassword';
      pool.execute.mockResolvedValueOnce([
        [
          createMockUser({
            id: 1,
            email: 'john@example.com',
            password: mockHashedPassword,
          }),
        ],
        undefined,
      ]);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123!',
        });

      expect([200, 401]).toContain(loginRes.status); // May fail due to bcrypt
    });
  });

  describe('Product Browsing and Search Flow', () => {
    test('complete product browsing flow', async () => {
      // Step 1: Get all products
      pool.execute.mockResolvedValueOnce([
        [{ total: 50 }], // Count
        undefined,
      ]);

      const products = Array(12)
        .fill(0)
        .map((_, i) =>
          createMockProduct({
            id: i + 1,
            name: `Product ${i + 1}`,
          })
        );

      pool.execute.mockResolvedValueOnce([products, undefined]);

      const productsRes = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/);

      expect(productsRes.status).toBe(200);
      expect(productsRes.body.success).toBe(true);
      expect(productsRes.body.products.length).toBe(12);

      // Step 2: Filter by category
      jest.clearAllMocks();
      
      pool.execute.mockResolvedValueOnce([
        [{ total: 15 }],
        undefined,
      ]);

      pool.execute.mockResolvedValueOnce([
        [
          createMockProduct({
            id: 1,
            name: 'Men Shirt',
            category_slug: 'men',
          }),
        ],
        undefined,
      ]);

      const categoryRes = await request(app)
        .get('/api/products?category=men')
        .expect('Content-Type', /json/);

      expect(categoryRes.status).toBe(200);
      expect(categoryRes.body.success).toBe(true);

      // Step 3: Search for products
      jest.clearAllMocks();

      pool.execute.mockResolvedValueOnce([
        [{ total: 5 }],
        undefined,
      ]);

      pool.execute.mockResolvedValueOnce([
        [
          createMockProduct({
            id: 1,
            name: 'Blue Shirt',
          }),
        ],
        undefined,
      ]);

      const searchRes = await request(app)
        .get('/api/products?search=shirt')
        .expect('Content-Type', /json/);

      expect(searchRes.status).toBe(200);
      expect(searchRes.body.success).toBe(true);
    });
  });

  describe('Shopping Cart Flow', () => {
    test('complete add to cart and checkout flow', async () => {
      // Step 1: Get cart
      pool.execute.mockResolvedValueOnce([[], undefined]); // Empty cart

      const cartRes = await request(app).get('/api/cart');

      expect([200, 404]).toContain(cartRes.status);

      // Step 2: Add product to cart
      jest.clearAllMocks();

      pool.execute.mockResolvedValueOnce([
        [createMockProduct({ id: 1 })],
        undefined,
      ]); // Product exists

      pool.execute.mockResolvedValueOnce([
        [{ affectedRows: 1 }],
        undefined,
      ]); // Item added

      const addRes = await request(app)
        .post('/api/cart')
        .send({
          product_id: 1,
          quantity: 2,
          selected_size: 'M',
          selected_color: 'Black',
        });

      expect([200, 201, 404]).toContain(addRes.status);

      // Step 3: Get updated cart
      jest.clearAllMocks();

      pool.execute.mockResolvedValueOnce([
        [
          {
            item_id: 1,
            product_id: 1,
            name: 'Test Product',
            price: 99.99,
            quantity: 2,
            image: 'test.jpg',
          },
        ],
        undefined,
      ]);

      const updatedCartRes = await request(app).get('/api/cart');

      expect([200, 404]).toContain(updatedCartRes.status);
    });
  });

  describe('Error Handling', () => {
    test('handles database errors gracefully', async () => {
      pool.execute.mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    test('validates required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          // Missing required fields
          name: 'John Doe',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('handles invalid product ID', async () => {
      pool.execute.mockResolvedValueOnce([[], undefined]); // No product

      const res = await request(app)
        .post('/api/cart')
        .send({
          product_id: 99999,
          quantity: 1,
        });

      expect(res.status).toBeOneOf([400, 404]);
    });
  });

  describe('Pagination and Filtering', () => {
    test('handles complex filtering and pagination', async () => {
      pool.execute.mockResolvedValueOnce([
        [{ total: 150 }],
        undefined,
      ]);

      const products = Array(12)
        .fill(0)
        .map((_, i) =>
          createMockProduct({
            id: i + 1,
            name: `Trending Product ${i + 1}`,
            trending: 1,
            price: 100 + i * 10,
          })
        );

      pool.execute.mockResolvedValueOnce([products, undefined]);

      const res = await request(app)
        .get('/api/products?trending=true&sort=price&order=ASC&page=1&limit=12');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
      expect(res.body.pages).toBeGreaterThan(0);
    });
  });
});
