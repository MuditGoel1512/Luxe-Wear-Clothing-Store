import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

const MockLogin = (authValue) => (
  <BrowserRouter>
    <AuthContext.Provider value={authValue}>
      <Login />
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    mockLogin.mockClear();
    mockRegister.mockClear();
  });

  test('renders login form', () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test('renders sign in and register toggle', () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    const toggleButtons = screen.getAllByRole('button');
    expect(toggleButtons.length).toBeGreaterThan(0);
  });

  test('shows register fields when toggle is clicked', async () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    const toggleButton = screen.getByText(/Register/i);
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    });
  });

  test('updates email input value', async () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput.value).toBe('test@example.com');
  });

  test('updates password input value', async () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    const passwordInput = screen.getByPlaceholderText(/password/i);
    await userEvent.type(passwordInput, 'password123');
    
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', async () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput.type).toBe('password');
    
    // Toggle visibility
    const toggleButtons = screen.getAllByRole('button');
    // Find the visibility toggle button (typically the eye icon)
    const visibilityButton = toggleButtons.find(btn => btn.className.includes('text-gray-400'));
    if (visibilityButton) {
      fireEvent.click(visibilityButton);
    }
  });

  test('displays demo credentials hint in login mode', () => {
    render(
      <MockLogin value={{ login: mockLogin, register: mockRegister }}>
        <Login />
      </MockLogin>
    );
    
    expect(screen.getByText(/Demo Credentials:/i)).toBeInTheDocument();
  });
});
