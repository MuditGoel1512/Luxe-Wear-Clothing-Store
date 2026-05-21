/**
 * Backend test utilities
 */

/**
 * Create mock database pool
 */
function createMockPool() {
  return {
    execute: jest.fn(),
    getConnection: jest.fn(),
    query: jest.fn(),
  };
}

/**
 * Create mock request object
 */
function createMockRequest(overrides = {}) {
  return {
    params: {},
    query: {},
    body: {},
    headers: {
      authorization: 'Bearer test-token',
    },
    user: {
      id: 1,
      email: 'test@example.com',
      role: 'user',
    },
    ...overrides,
  };
}

/**
 * Create mock response object
 */
function createMockResponse() {
  const res = {};
  
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  
  return res;
}

/**
 * Create mock user
 */
function createMockUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$12$hashedPassword',
    role: 'user',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock product
 */
function createMockProduct(overrides = {}) {
  return {
    id: 1,
    name: 'Test Product',
    description: 'A test product',
    price: 99.99,
    original_price: 129.99,
    image: 'test.jpg',
    category_id: 1,
    category_name: 'Men',
    category_slug: 'men',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'White', 'Blue']),
    stock: 100,
    featured: 0,
    trending: 0,
    rating: 4.5,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock order
 */
function createMockOrder(overrides = {}) {
  return {
    id: 1,
    user_id: 1,
    total_amount: 299.97,
    items_count: 3,
    status: 'pending',
    payment_id: 'razorpay_order_123',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock validation error
 */
function createMockValidationError(message = 'Validation failed') {
  return {
    msg: message,
    param: 'field',
    location: 'body',
    value: '',
  };
}

/**
 * Assert response status
 */
function assertResponseStatus(res, expectedStatus) {
  expect(res.status).toHaveBeenCalledWith(expectedStatus);
}

/**
 * Assert response JSON
 */
function assertResponseJSON(res, expectedData) {
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining(expectedData));
}

/**
 * Assert API error response
 */
function assertErrorResponse(res, status, message) {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: false,
      message: expect.stringContaining(message),
    })
  );
}

/**
 * Assert API success response
 */
function assertSuccessResponse(res, status = 200) {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: true,
    })
  );
}

/**
 * Generate valid JWT token for testing
 */
function generateTestJWT(userId = 1) {
  // This is a dummy JWT for testing purposes
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ id: userId, iat: Math.floor(Date.now() / 1000) })).toString('base64');
  const signature = 'test-signature';
  
  return `${header}.${payload}.${signature}`;
}

module.exports = {
  createMockPool,
  createMockRequest,
  createMockResponse,
  createMockUser,
  createMockProduct,
  createMockOrder,
  createMockValidationError,
  assertResponseStatus,
  assertResponseJSON,
  assertErrorResponse,
  assertSuccessResponse,
  generateTestJWT,
};
