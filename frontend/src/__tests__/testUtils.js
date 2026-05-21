import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

/**
 * Custom render function that wraps components with required providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.authValue - Auth context value
 * @param {Object} options.cartValue - Cart context value
 * @param {Object} options.wishlistValue - Wishlist context value
 * @param {Object} options.renderOptions - Additional render options
 */
export function renderWithProviders(
  ui,
  {
    authValue = {
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAdmin: false,
    },
    cartValue = {
      items: [],
      itemCount: 0,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    },
    wishlistValue = {
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
    },
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <CartContext.Provider value={cartValue}>
            <WishlistContext.Provider value={wishlistValue}>
              {children}
            </WishlistContext.Provider>
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Wait for an element to appear in the document
 * @param {Function} callback - Function that returns the element
 * @param {number} timeout - Maximum wait time
 */
export function waitForElement(callback, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      try {
        const element = callback();
        if (element) {
          clearInterval(interval);
          resolve(element);
        }
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(new Error('Element not found within timeout'));
        }
      }
    }, 50);
  });
}

/**
 * Create mock API response
 * @param {*} data - Response data
 * @param {boolean} success - Success status
 */
export function mockApiResponse(data, success = true) {
  return {
    data: {
      success,
      ...data,
    },
    status: success ? 200 : 400,
    statusText: success ? 'OK' : 'Bad Request',
  };
}

/**
 * Create mock user object
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

/**
 * Create mock product object
 */
export function createMockProduct(overrides = {}) {
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
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Blue'],
    stock: 100,
    featured: false,
    trending: false,
    rating: 4.5,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock cart item
 */
export function createMockCartItem(overrides = {}) {
  return {
    id: 1,
    product_id: 1,
    name: 'Test Product',
    price: 99.99,
    image: 'test.jpg',
    quantity: 1,
    selected_size: 'M',
    selected_color: 'Black',
    ...overrides,
  };
}

/**
 * Setup default mocks for common modules
 */
export function setupDefaultMocks() {
  // Mock API module
  jest.mock('../utils/api', () => ({
    authAPI: {
      login: jest.fn(),
      register: jest.fn(),
      getCurrentUser: jest.fn(),
    },
    productAPI: {
      getAll: jest.fn(),
      getById: jest.fn(),
      getFeatured: jest.fn(),
      search: jest.fn(),
    },
    cartAPI: {
      getCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
    },
  }));

  // Mock react-hot-toast
  jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    default: {
      success: jest.fn(),
      error: jest.fn(),
      loading: jest.fn(),
    },
  }));
}

/**
 * Export all utilities
 */
export * from '@testing-library/react';
