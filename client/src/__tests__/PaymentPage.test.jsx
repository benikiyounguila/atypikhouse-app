import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PaymentPage from '../pages/PaymentPage';
import axiosInstance from '@/utils/axios';
import { loadStripe } from '@stripe/stripe-js';

// Mock axiosInstance
jest.mock('@/utils/axios', () => ({
  post: jest.fn(),
}));

// Mock @stripe/stripe-js
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    elements: jest.fn(() => ({
      create: jest.fn(),
    })),
    confirmPayment: jest.fn(),
  })),
}));

// Mock the CheckoutForm component to avoid rendering its internal logic
jest.mock('../components/ui/CheckoutForm', () => () => <div>Mock CheckoutForm</div>);

describe('PaymentPage', () => {
  it('should fetch client secret and render CheckoutForm when successful', async () => {
    const mockClientSecret = 'test_client_secret_123';
    axiosInstance.post.mockResolvedValueOnce({ data: { clientSecret: mockClientSecret } });

    render(
      <MemoryRouter initialEntries={['/payment/booking123']}>
        <Routes>
          <Route path="/payment/:id" element={<PaymentPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if loading message is displayed initially (optional, depends on your component)
    // expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the client secret to be fetched and CheckoutForm to be rendered
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(`bookings/create-payment-intent/booking123`);
      expect(screen.getByText('Mock CheckoutForm')).toBeInTheDocument();
    });
  });

  it('should handle error when fetching client secret', async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter initialEntries={['/payment/booking456']}>
        <Routes>
          <Route path="/payment/:id" element={<PaymentPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error to be handled (e.g., no CheckoutForm rendered, or error message)
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(`bookings/create-payment-intent/booking456`);
      expect(screen.queryByText('Mock CheckoutForm')).not.toBeInTheDocument();
      // You might want to add an assertion for an error message if your component displays one
      // expect(screen.getByText(/Error fetching client secret/i)).toBeInTheDocument();
    });
  });
});
