const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user.js");

const {
  createBookings,
  getBookings,
} = require("../controllers/bookingController");
const { createPaymentIntent } = require("../controllers/paymentController");

// Protected routes (user must be logged in)
router.route("/").get(isLoggedIn, getBookings).post(isLoggedIn, createBookings);
router.post('/create-payment-intent/:id', isLoggedIn, createPaymentIntent);


module.exports = router;
