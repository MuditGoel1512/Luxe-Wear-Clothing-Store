# Testing Guide for LuxeWear

This project includes comprehensive unit and integration tests for both frontend and backend.

## Frontend Testing

### Setup
The frontend uses **Jest** and **React Testing Library** which are already configured with `react-scripts`.

### Running Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests in watch mode (re-run on file changes)
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Login.test.js
```

### Frontend Test Files
- `src/__tests__/Navbar.test.js` - Tests for Navbar component with debouncing functionality
- `src/__tests__/Login.test.js` - Tests for Login/Register forms
- `src/__tests__/Cart.test.js` - Tests for Cart page and calculations
- `src/__tests__/Products.test.js` - Tests for Products page and filtering
- `src/__tests__/Login.test.js` - Tests for authentication pages

### Frontend Test Coverage
- Component rendering
- User interactions (click, type, submit)
- State management
- Form validation
- Navigation
- Conditional rendering based on auth state

---

## Backend Testing

### Setup
First, install testing dependencies:

```bash
cd backend

npm install
```

The backend uses **Jest** and **Supertest** for API testing.

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test auth.test.js

# Run tests with coverage
npm test -- --coverage
```

### Backend Test Files
- `__tests__/auth.test.js` - Tests for authentication endpoints
  - User registration with validation
  - User login with credentials
  - Error handling for duplicate emails
  - Password validation

- `__tests__/products.test.js` - Tests for product endpoints
  - Get all products with pagination
  - Filter by category, featured, trending
  - Search functionality
  - Sorting options
  - Database error handling

- `__tests__/cart.test.js` - Tests for cart endpoints
  - Get cart items
  - Add item to cart
  - Remove item from cart
  - Update quantity
  - Clear cart

### Backend Test Coverage
- API endpoint responses
- Input validation
- Error handling
- Database operations (mocked)
- Query parameter filtering
- Pagination logic

---

## Writing New Tests

### Frontend Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  test('renders component correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user input', async () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(input.value).toBe('test');
  });
});
```

### Backend Example
```javascript
const request = require('supertest');
const app = require('../server');

describe('API Endpoint', () => {
  test('should return success response', async () => {
    const res = await request(app)
      .get('/api/endpoint');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should handle errors', async () => {
    const res = await request(app)
      .post('/api/endpoint')
      .send({ invalid: 'data' });
    
    expect(res.status).toBe(400);
  });
});
```

---

## Testing Best Practices

### Frontend
1. Test user behavior, not implementation details
2. Use semantic queries (getByRole, getByLabelText)
3. Use `waitFor` for async operations
4. Mock external dependencies (API calls, context)
5. Test accessibility

### Backend
1. Mock database calls to avoid test database setup
2. Test both success and error cases
3. Validate input and error responses
4. Use descriptive test names
5. Group related tests with `describe`

---

## CI/CD Integration

To run tests automatically on code push:

1. **GitHub Actions** - Create `.github/workflows/test.yml`
2. **Pre-commit hooks** - Run tests before committing
3. **Code coverage** - Track coverage metrics

---

## Troubleshooting

### Frontend Tests Fail with "Cannot find module"
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm test -- --clearCache`

### Backend Tests Timeout
- Increase timeout in jest.config.js: `testTimeout: 30000`
- Check for unresolved promises
- Use `--detectOpenHandles` flag

### Database Connection Errors
- Mocks are properly configured (tests don't need real database)
- Verify mock setup in test file

---

## Test Coverage Goals

- **Frontend**: 70%+ coverage on components and pages
- **Backend**: 80%+ coverage on controllers and routes
- All critical user flows tested
- Error scenarios covered

