const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");
const {
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
} = require("../controllers/ownerController");

// Middleware pour vérifier l'authentification
const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Accès refusé : Vous devez être propriétaire pour accéder à cette ressource.",
  });
};

// Toutes les routes nécessitent une authentification et le rôle propriétaire
router.use(isLoggedIn);
router.use(isOwner);

// Routes pour les logements
router.get("/places", getMyPlaces);
router.get("/places/:id", getMyPlace);
router.post("/places", createPlace);
router.put("/places/:id", updatePlace);
router.patch("/places/:id/toggle", togglePlaceStatus);
router.delete("/places/:id", deletePlace);

// Routes pour les réservations
router.get("/bookings", getMyBookings);

// Routes pour le solde et les finances
router.get("/balance", getMyBalance);
router.post("/withdrawal", requestWithdrawal);

// Routes pour les statistiques
router.get("/stats", getMyStats);

module.exports = router; 