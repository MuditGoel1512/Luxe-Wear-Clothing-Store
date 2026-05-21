// Jest setup for backend tests
// This file runs before all backend tests

// Set test environment to node
process.env.NODE_ENV = 'test';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'luxe_wear_test';

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error output
  error: console.error,
};

// Extend Jest matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      pass,
      message: () => `expected ${received} to be a valid date`,
    };
  },
  toBeValidJWT(received) {
    const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    const pass = typeof received === 'string' && jwtRegex.test(received);
    return {
      pass,
      message: () => `expected ${received} to be a valid JWT`,
    };
  },
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
