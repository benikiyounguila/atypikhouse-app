const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Booking = require('../models/Booking');

exports.createPaymentIntent = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.price * 100,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
