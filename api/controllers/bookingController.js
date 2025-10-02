const Booking = require('../models/Booking');
const Place = require('../models/Place');
const User = require('../models/User');

// Books a place
exports.createBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, numOfGuests, name, phone, price } =
      req.body;

    // Vérifier que le logement existe et est actif
    const placeDoc = await Place.findById(place);
    if (!placeDoc) {
      return res.status(404).json({
        message: 'Logement non trouvé',
      });
    }

    if (!placeDoc.isActive) {
      return res.status(400).json({
        message: 'Ce logement n\'est pas disponible actuellement',
      });
    }

    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numOfGuests,
      name,
      phone,
      price,
    });

    // Mettre à jour le solde du propriétaire (90% du prix pour la commission)
    const ownerCommission = price * 0.9; // 90% pour le propriétaire
    await User.findByIdAndUpdate(placeDoc.owner, {
      $inc: { balance: ownerCommission }
    });

    res.status(200).json({
      booking,
      message: 'Réservation créée avec succès',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific bookings
exports.getBookings = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to access this page!' });
    }

    const booking = await Booking.find({ user: userData.id }).populate('place')

    res
      .status(200).json({ booking, success: true })


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};
