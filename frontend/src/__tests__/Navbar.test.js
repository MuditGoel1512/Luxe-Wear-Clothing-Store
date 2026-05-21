import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const MockNavbar = () => (
  <BrowserRouter>
    <AuthContext.Provider value={{ user: null, logout: jest.fn(), isAdmin: false }}>
      <CartContext.Provider value={{ itemCount: 0 }}>
        <Navbar />
      </CartContext.Provider>
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('Navbar Component', () => {
  test('renders navbar with logo', () => {
    render(<MockNavbar />);
    const logo = screen.getByText('LUXEWEAR');
    expect(logo).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<MockNavbar />);
    const searchButtons = screen.getAllByRole('button');
    expect(searchButtons.length).toBeGreaterThan(0);
  });

  test('displays search bar when search button is clicked', async () => {
    render(<MockNavbar />);
    const searchButton = screen.getAllByRole('button')[0];
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for products...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  test('updates search input value on change', async () => {
    render(<MockNavbar />);
    const searchButton = screen.getAllByRole('button')[0];
    fireEvent.click(searchButton);
    
    const searchInput = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(searchInput, 'test product');
    
    expect(searchInput.value).toBe('test product');
  });

  test('displays cart count badge when items exist', () => {
    const cartValue = { itemCount: 5 };
    const rendered = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: null, logout: jest.fn(), isAdmin: false }}>
          <CartContext.Provider value={cartValue}>
            <Navbar />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    // Cart count should be visible
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders login button when user is not authenticated', () => {
    render(<MockNavbar />);
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

  test('renders user menu when user is authenticated', () => {
    const authValue = {
      user: { name: 'John', email: 'john@example.com' },
      logout: jest.fn(),
      isAdmin: false
    };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <CartContext.Provider value={{ itemCount: 0 }}>
            <Navbar />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    const userInitial = screen.getByText('J');
    expect(userInitial).toBeInTheDocument();
  });

  test('renders admin panel link for admin users', () => {
    const authValue = {
      user: { name: 'Admin', email: 'admin@luxewear.com' },
      logout: jest.fn(),
      isAdmin: true
    };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <CartContext.Provider value={{ itemCount: 0 }}>
            <Navbar />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    // Click user menu to open it
    const userButton = screen.getByText('A');
    fireEvent.click(userButton);
    
    // Check for admin panel link
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
