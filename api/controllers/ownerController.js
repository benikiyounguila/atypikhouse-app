const asyncHandler = require("express-async-handler");
const Place = require("../models/Place");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Middleware pour vérifier si l'utilisateur est propriétaire
const isOwner = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "owner") {
    res.status(403);
    throw new Error("Accès refusé. Rôle propriétaire requis.");
  }
  next();
});

// Obtenir les logements du propriétaire
const getMyPlaces = asyncHandler(async (req, res) => {
  console.log('[OWNER CONTROLLER] getMyPlaces called for user:', req.user._id, 'role:', req.user.role);
  
  const places = await Place.find({ owner: req.user._id }).populate("owner", "name email");
  console.log('[OWNER CONTROLLER] Found places:', places.length);
  
  res.status(200).json({
    success: true,
    data: places,
  });
});

// Obtenir un logement spécifique du propriétaire
const getMyPlace = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ 
    _id: req.params.id, 
    owner: req.user._id 
  }).populate("owner", "name email");

  if (!place) {
    res.status(404);
    throw new Error("Logement non trouvé ou vous n'êtes pas le propriétaire");
  }

  res.status(200).json({
    success: true,
    data: place,
  });
});

// Créer un nouveau logement
const createPlace = asyncHandler(async (req, res) => {
  const placeData = {
    ...req.body,
    owner: req.user._id,
  };

  const place = await Place.create(placeData);
  
  res.status(201).json({
    success: true,
    data: place,
  });
});

// Mettre à jour un logement
const updatePlace = asyncHandler(async (req, res) => {
  let place = await Place.findOne({ 
    _id: req.params.id, 
    owner: req.user._id 
  });

  if (!place) {
    res.status(404);
    throw new Error("Logement non trouvé ou vous n'êtes pas le propriétaire");
  }

  place = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: place,
  });
});

// Activer/Désactiver un logement
const togglePlaceStatus = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ 
    _id: req.params.id, 
    owner: req.user._id 
  });

  if (!place) {
    res.status(404);
    throw new Error("Logement non trouvé ou vous n'êtes pas le propriétaire");
  }

  place.isActive = !place.isActive;
  await place.save();

  res.status(200).json({
    success: true,
    data: place,
    message: `Logement ${place.isActive ? 'activé' : 'désactivé'} avec succès`,
  });
});

// Supprimer un logement
const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ 
    _id: req.params.id, 
    owner: req.user._id 
  });

  if (!place) {
    res.status(404);
    throw new Error("Logement non trouvé ou vous n'êtes pas le propriétaire");
  }

  await Place.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Logement supprimé avec succès",
  });
});

// Obtenir les réservations des logements du propriétaire
const getMyBookings = asyncHandler(async (req, res) => {
  console.log('[OWNER CONTROLLER] getMyBookings called for user:', req.user._id, 'role:', req.user.role);
  
  // Récupérer tous les logements du propriétaire
  const myPlaces = await Place.find({ owner: req.user._id }).select("_id");
  const placeIds = myPlaces.map(place => place._id);
  console.log('[OWNER CONTROLLER] User places:', placeIds.length);

  // Récupérer toutes les réservations pour ces logements
  const bookings = await Booking.find({ 
    place: { $in: placeIds } 
  })
  .populate("user", "name email")
  .populate("place", "title address photos")
  .sort({ createdAt: -1 });

  console.log('[OWNER CONTROLLER] Found bookings:', bookings.length);

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

// Obtenir le solde du propriétaire
const getMyBalance = asyncHandler(async (req, res) => {
  console.log('[OWNER CONTROLLER] getMyBalance called for user:', req.user._id, 'role:', req.user.role);
  
  const user = await User.findById(req.user._id).select("balance");
  console.log('[OWNER CONTROLLER] User balance:', user.balance);
  
  res.status(200).json({
    success: true,
    data: {
      balance: user.balance,
    },
  });
});

// Demander un retrait (simulation)
const requestWithdrawal = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Montant invalide");
  }

  const user = await User.findById(req.user._id);

  if (user.balance < amount) {
    res.status(400);
    throw new Error("Solde insuffisant");
  }

  // Simuler le retrait (en production, cela serait géré par un système de paiement)
  user.balance -= amount;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Retrait de ${amount}€ effectué avec succès`,
    data: {
      newBalance: user.balance,
    },
  });
});

// Obtenir les statistiques du propriétaire
const getMyStats = asyncHandler(async (req, res) => {
  console.log('[OWNER CONTROLLER] getMyStats called for user:', req.user._id, 'role:', req.user.role);
  
  // Récupérer tous les logements du propriétaire
  const myPlaces = await Place.find({ owner: req.user._id });
  const placeIds = myPlaces.map(place => place._id);
  console.log('[OWNER CONTROLLER] User places:', myPlaces.length);

  // Compter les réservations
  const totalBookings = await Booking.countDocuments({ 
    place: { $in: placeIds } 
  });
  console.log('[OWNER CONTROLLER] Total bookings:', totalBookings);

  // Calculer les revenus totaux
  const bookings = await Booking.find({ 
    place: { $in: placeIds } 
  }).select("price");

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0);
  console.log('[OWNER CONTROLLER] Total revenue:', totalRevenue);

  // Logements actifs/inactifs
  const activePlaces = myPlaces.filter(place => place.isActive).length;
  const inactivePlaces = myPlaces.length - activePlaces;
  console.log('[OWNER CONTROLLER] Active places:', activePlaces, 'Inactive places:', inactivePlaces);

  const statsData = {
    totalPlaces: myPlaces.length,
    activePlaces,
    inactivePlaces,
    totalBookings,
    totalRevenue,
    currentBalance: req.user.balance,
  };

  console.log('[OWNER CONTROLLER] Stats data:', statsData);

  res.status(200).json({
    success: true,
    data: statsData,
  });
});

module.exports = {
  isOwner,
  getMyPlaces,
  getMyPlace,
  createPlace,
  updatePlace,
  togglePlaceStatus,
  deletePlace,
  getMyBookings,
  getMyBalance,
  requestWithdrawal,
  getMyStats,
};
