# Quick Start: Running Tests

## Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests in watch mode (automatically re-runs on file changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test Navbar.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="debounce"
```

### Frontend Test Results Example:
```
PASS  src/__tests__/Navbar.test.js (2.3s)
  Navbar Component
    ✓ renders navbar with logo (45ms)
    ✓ displays search button (30ms)
    ✓ displays search bar when search button is clicked (120ms)
    ✓ updates search input value on change (85ms)
    ✓ displays cart count badge when items exist (50ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        3.42s
```

---

## Backend Tests

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test auth.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="register"

# Run with coverage
npm test -- --coverage

# Run with verbose output
npm test -- --verbose

# Run single test
npm test -- -t "should register a new user successfully"
```

### Backend Test Results Example:
```
PASS  __tests__/auth.test.js (1.5s)
  Auth Controller - Register
    ✓ should register a new user successfully (85ms)
    ✓ should reject registration with invalid email (45ms)
    ✓ should reject registration with weak password (40ms)
    ✓ should reject if email already exists (60ms)

PASS  __tests__/products.test.js (2.1s)
  Product Controller - Get All Products
    ✓ should return all products with default pagination (95ms)
    ✓ should filter products by category (75ms)
    ✓ should search products by keyword (80ms)

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        4.23s
```

---

## Running All Tests (Frontend + Backend)

```bash
# From root directory
# Terminal 1: Frontend tests
cd frontend && npm test

# Terminal 2 (in another terminal): Backend tests
cd backend && npm test
```

---

## Understanding Test Output

### Test Statistics
- **Test Suites**: Total test files
  - `passed`: Successfully executed files
  - `total`: All test files
- **Tests**: Individual test cases
  - `passed`: Tests that passed
  - `total`: All tests
- **Snapshots**: Visual regression tests
- **Time**: Total execution time

### Test Results
- ✓ = Test passed
- ✗ = Test failed
- ○ = Test skipped

---

## Common Testing Commands

### Run Only Failing Tests
```bash
# Frontend
cd frontend && npm test -- --onlyChanged

# Backend
cd backend && npm test -- --onlyChanged
```

### Update Snapshots (if used)
```bash
# Frontend
cd frontend && npm test -- --updateSnapshot

# Backend
cd backend && npm test -- --updateSnapshot
```

### Generate Coverage Report
```bash
# Frontend
cd frontend && npm test -- --coverage

# Backend
cd backend && npm test -- --coverage
```

The coverage report shows what percentage of code is tested.

---

## Debugging Tests

### Frontend Debugging
```bash
# Run tests with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open chrome://inspect in Chrome
```

### Backend Debugging
```bash
# Add debugger statement in test
// debugger;

# Run with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output
```bash
# Frontend
cd frontend && npm test -- --verbose

# Backend
cd backend && npm test -- --verbose
```

---

## Writing Tests

See [TESTING.md](./TESTING.md) for detailed guide on writing new tests.

### Test File Naming Convention
- Frontend: `src/__tests__/ComponentName.test.js`
- Backend: `__tests__/routeName.test.js`

### Test Structure
```javascript
describe('Feature Name', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

---

## Continuous Integration

Tests will automatically run:
- On every code push (via GitHub Actions)
- Before commits (via pre-commit hooks - if configured)
- In pull requests

Ensure all tests pass before merging to main branch.

---

## Tips & Tricks

1. **Focus on single test**: Use `test.only()` to run just one test
2. **Skip test**: Use `test.skip()` to skip a test temporarily
3. **Watch specific file**: `npm test -- Navbar` runs only Navbar tests
4. **Clear cache**: `npm test -- --clearCache` if tests behave unexpectedly
5. **Use good test names**: Makes debugging easier when tests fail

---

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Tests timeout
- Increase timeout in jest config: `testTimeout: 30000`
- Check for unresolved promises
- Use `--detectOpenHandles` flag

### React Testing Library errors
- Use correct queries (getByRole, getByLabelText, etc.)
- Wrap components with required providers
- Use `waitFor()` for async operations

