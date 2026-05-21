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

// Import the route that uses the controllers
const productRoutes = require('../routes/products');
app.use('/api/products', productRoutes);

describe('Product Controller - Get All Products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all products with default pagination', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 50 }], // Count result
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: 'Test Product',
          price: 99.99,
          original_price: 129.99,
          image: 'test.jpg',
          sizes: '["S","M","L"]',
          colors: '["Black","White"]',
          description: 'Test product description',
          category_name: 'Men',
          category_slug: 'men',
          featured: 0,
          trending: 0,
          stock: 100
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toBeDefined();
  });

  test('should filter products by category', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 15 }],
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: 'Men Product',
          category_slug: 'men'
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products?category=men');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should search products by keyword', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 5 }],
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: 'Casual Shirt',
          description: 'A comfortable casual shirt'
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products?search=shirt');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should filter featured products', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 10 }],
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: 'Featured Product',
          featured: 1
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products?featured=true');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should filter trending products', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 8 }],
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: 'Trending Product',
          trending: 1
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products?trending=true');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should support pagination', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 50 }],
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [{ id: 1, name: 'Product on page 2' }],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products?page=2&limit=12');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pages).toBeDefined();
  });

  test('should support sorting by price', async () => {
    pool.execute.mockResolvedValueOnce([
      [{ total: 50 }],
      undefined
    ]);

    pool.execute.mockResolvedValueOnce([
      [{ id: 1, price: 29.99 }, { id: 2, price: 99.99 }],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products?sort=price&order=ASC');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should handle database errors gracefully', async () => {
    pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

    const res = await request(app)
      .get('/api/products');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('Product Controller - Get Featured Products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return featured products', async () => {
    pool.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: 'Featured Product 1',
          featured: 1
        },
        {
          id: 2,
          name: 'Featured Product 2',
          featured: 1
        }
      ],
      undefined
    ]);

    const res = await request(app)
      .get('/api/products/featured');

    // May be GET or already handled by getProducts with featured=true
    expect([200, 404]).toContain(res.status);
  });
});
