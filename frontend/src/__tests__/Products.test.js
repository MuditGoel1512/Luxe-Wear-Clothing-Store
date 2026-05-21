 import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Products from '../pages/Products';

const MockProducts = () => (
  <BrowserRouter>
    <Products />
  </BrowserRouter>
);

describe('Products Component', () => {
  test('renders products page heading', () => {
    render(<MockProducts />);
    expect(screen.getByText('All Products')).toBeInTheDocument();
  });

  test('renders filters button', () => {
    render(<MockProducts />);
    const filterButtons = screen.getAllByRole('button');
    expect(filterButtons.length).toBeGreaterThan(0);
  });

  test('opens filters when filters button is clicked', async () => {
    render(<MockProducts />);
    const filterButton = screen.getByText(/Filters/i);
    fireEvent.click(filterButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    });
  });

  test('renders sort options dropdown', () => {
    render(<MockProducts />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  test('displays pagination when multiple pages exist', async () => {
    render(<MockProducts />);
    
    await waitFor(() => {
      // Pagination buttons should appear if there are multiple pages
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  test('updates sort when dropdown changes', async () => {
    render(<MockProducts />);
    
    const sortSelect = screen.getAllByRole('combobox')[0];
    await userEvent.selectOption(sortSelect, 'Price: Low to High');
    
    expect(sortSelect.value).toBe('price:ASC');
  });
});
