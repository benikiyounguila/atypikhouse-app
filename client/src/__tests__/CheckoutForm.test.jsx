import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutForm from '../components/ui/CheckoutForm';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// Mock Stripe hooks and components
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
  useElements: jest.fn(),
  PaymentElement: jest.fn(() => <div>Mock PaymentElement</div>), // Mock the component
}));

describe('CheckoutForm', () => {
  let mockStripe;
  let mockElements;

  beforeEach(() => {
    mockStripe = {
      confirmPayment: jest.fn(),
      retrievePaymentIntent: jest.fn(),
    };
    mockElements = {
      getElement: jest.fn(() => ({})), // Mock getElement to return a dummy object
    };

    useStripe.mockReturnValue(mockStripe);
    useElements.mockReturnValue(mockElements);
  });

  it('should render the PaymentElement and a submit button', async () => {
    render(<CheckoutForm />);

    expect(screen.getByText('Mock PaymentElement')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Payez/i })).toBeInTheDocument();
  });

  it('should call confirmPayment on form submission', async () => {
    mockStripe.confirmPayment.mockResolvedValue({ error: undefined });

    render(<CheckoutForm />);

    fireEvent.click(screen.getByRole('button', { name: /Payez/i }));

    await waitFor(() => {
      expect(mockStripe.confirmPayment).toHaveBeenCalledTimes(1);
      expect(mockStripe.confirmPayment).toHaveBeenCalledWith({
        elements: mockElements,
        confirmParams: {
          return_url: `${window.location.origin}/account/bookings`,
        },
      });
    });
  });

  it('should display an error message if confirmPayment fails', async () => {
    const errorMessage = 'Your card was declined.';
    mockStripe.confirmPayment.mockResolvedValue({
      error: { type: 'card_error', message: errorMessage },
    });

    render(<CheckoutForm />);

    fireEvent.click(screen.getByRole('button', { name: /Payez/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should disable the button when loading', async () => {
    mockStripe.confirmPayment.mockReturnValue(new Promise(() => {})); // Never resolve to keep it loading

    render(<CheckoutForm />);

    const payButton = screen.getByRole('button', { name: /Payez/i });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(payButton).toBeDisabled();
    });
  });
});
