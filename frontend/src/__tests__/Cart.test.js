import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../pages/Cart';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const MockCart = (cartValue, authValue) => (
  <BrowserRouter>
    <AuthContext.Provider value={authValue || { user: null, logout: jest.fn() }}>
      <CartContext.Provider value={cartValue}>
        <Cart />
      </CartContext.Provider>
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('Cart Component', () => {
  test('renders empty cart message when no items', () => {
    const cartValue = {
      items: [],
      itemCount: 0,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn()
    };

    render(<MockCart cartValue={cartValue} />);
    
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test('renders cart items when they exist', () => {
    const cartValue = {
      items: [
        { 
          id: 1, 
          name: 'Test Product', 
          price: 100, 
          image: 'test.jpg',
          quantity: 2 
        }
      ],
      itemCount: 1,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn()
    };

    render(<MockCart cartValue={cartValue} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders checkout section when items exist', () => {
    const cartValue = {
      items: [
        { 
          id: 1, 
          name: 'Test Product', 
          price: 100, 
          image: 'test.jpg',
          quantity: 1 
        }
      ],
      itemCount: 1,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn()
    };

    render(<MockCart cartValue={cartValue} />);
    
    expect(screen.getByText(/Proceed to Checkout/i)).toBeInTheDocument();
  });

  test('calculates total correctly', () => {
    const cartValue = {
      items: [
        { 
          id: 1, 
          name: 'Product 1', 
          price: 100, 
          image: 'test1.jpg',
          quantity: 2 
        },
        { 
          id: 2, 
          name: 'Product 2', 
          price: 50, 
          image: 'test2.jpg',
          quantity: 1 
        }
      ],
      itemCount: 2,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn()
    };

    render(<MockCart cartValue={cartValue} />);
    
    // Total should be 100*2 + 50*1 = 250
    const total = 250;
    expect(screen.getByText(new RegExp(`${total}`, 'i'))).toBeInTheDocument();
  });
});
