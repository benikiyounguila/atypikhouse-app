// Mock the stripe library first, before requiring the controller
const mockPaymentIntentsCreate = jest.fn();

jest.mock('stripe', () => {
  // This function is called when `require('stripe')` is executed.
  // It should return a function that, when called with the API key,
  // returns the mock Stripe instance.
  return jest.fn(() => ({
    paymentIntents: {
      create: mockPaymentIntentsCreate,
    },
  }));
});

const { createPaymentIntent } = require('../controllers/paymentController');
const Booking = require('../models/Booking');

// Mock the Booking model
jest.mock('../models/Booking');

describe('createPaymentIntent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'someBookingId' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reset mocks before each test
    Booking.findById.mockReset();
    mockPaymentIntentsCreate.mockReset(); // Directly reset the mock function
  });

  it('should create a payment intent and return client secret for a valid booking', async () => {
    const mockBooking = {
      _id: 'someBookingId',
      price: 100,
    };
    Booking.findById.mockResolvedValue(mockBooking);
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'test_client_secret' });

    await createPaymentIntent(req, res);

    expect(Booking.findById).toHaveBeenCalledWith('someBookingId');
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: 100 * 100, // price in cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    expect(res.json).toHaveBeenCalledWith({ clientSecret: 'test_client_secret' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 404 if booking is not found', async () => {
    Booking.findById.mockResolvedValue(null);

    await createPaymentIntent(req, res);

    expect(Booking.findById).toHaveBeenCalledWith('someBookingId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    expect(mockPaymentIntentsCreate).not.toHaveBeenCalled();
  });

  it('should return 500 if there is an error creating payment intent', async () => {
    const mockBooking = {
      _id: 'someBookingId',
      price: 100,
    };
    Booking.findById.mockResolvedValue(mockBooking);
    mockPaymentIntentsCreate.mockRejectedValue(new Error('Stripe error'));

    await createPaymentIntent(req, res);

    expect(Booking.findById).toHaveBeenCalledWith('someBookingId');
    expect(mockPaymentIntentsCreate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should handle booking with price 0', async () => {
    const mockBooking = {
      _id: 'someBookingId',
      price: 0,
    };
    Booking.findById.mockResolvedValue(mockBooking);
    mockPaymentIntentsCreate.mockResolvedValue({ client_secret: 'test_client_secret_zero' });

    await createPaymentIntent(req, res);

    expect(Booking.findById).toHaveBeenCalledWith('someBookingId');
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: 0,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    expect(res.json).toHaveBeenCalledWith({ clientSecret: 'test_client_secret_zero' });
  });
});
