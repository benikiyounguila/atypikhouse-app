const User = require("../models/User");

// Gestion des utilisateurs
// exports.createManager = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = new User({ name, email, password, isAdmin: true });
//     await user.save();
//     res.status(201).json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la création du gestionnaire',
//       error,
//     });
//   }
// };

const bcrypt = require("bcryptjs");

exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérification des données d'entrée
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash du mot de passe avant de sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });
    await user.save();

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du gestionnaire",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Fonction pour mettre à jour le rôle d'un utilisateur
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    });
  }
};

// Gestion des perks
const Place = require("../models/Place");

const basePerks = [
  { name: "wifi" },
  { name: "parking" },
  { name: "tv" },
  { name: "radio" },
  { name: "pets" },
  { name: "enterence" },
];

exports.getAllPerks = async (req, res) => {
  try {
    console.log('[ADMIN PERKS] Starting to fetch perks...');
    const startTime = Date.now();

    // Optimisation : récupérer seulement les perks uniques depuis la base de données
    const uniquePerks = await Place.distinct('perks');
    console.log(`[ADMIN PERKS] Found ${uniquePerks.length} unique perks in database`);

    // Combiner avec les perks de base
    const allPerksSet = new Set();
    
    // Ajouter les perks de base
    basePerks.forEach(perk => {
      allPerksSet.add(perk.name);
    });
    
    // Ajouter les perks uniques de la base de données
    uniquePerks.forEach(perk => {
      allPerksSet.add(perk);
    });

    // Convertir en tableau d'objets
    const allPerks = Array.from(allPerksSet).map(name => ({ name }));

    const endTime = Date.now();
    console.log(`[ADMIN PERKS] Perks fetched in ${endTime - startTime}ms`);

    res.status(200).json({
      success: true,
      data: allPerks,
    });
  } catch (error) {
    console.error('[ADMIN PERKS] Error:', error);
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur" });
  }
};

exports.addPerk = async (req, res) => {
  try {
    const { name } = req.body;
    const place = await Place.findOne();
    place.perks.push(name);
    await place.save();
    res.status(201).json({ success: true, data: place.perks });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur" });
  }
};

exports.deletePerk = async (req, res) => {
  try {
    const { name } = req.params;

    // Supprimer le perk de tous les lieux qui le contiennent
    const result = await Place.updateMany(
      { perks: name },
      { $pull: { perks: name } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Perk non trouvé dans les lieux existants ou déjà supprimé.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perk supprimé avec succès de tous les lieux.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur", error });
  }
};

// Gestion des propriétés

// Get all places
exports.getAllPlaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [places, total] = await Promise.all([
      Place.find().skip(skip).limit(limit),
      Place.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: places,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur", error });
  }
};

// Add a place
exports.addPlace = async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json({
      success: true,
      message: "Place added successfully",
      data: savedPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du lieu",
      error,
    });
  }
};

// Update a place
exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPlace = await Place.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPlace) {
      return res
        .status(404)
        .json({ success: false, message: "Place not found" });
    }

    res.status(200).json({
      success: true,
      message: "Place updated successfully",
      data: updatedPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du lieu",
      error,
    });
  }
};

// Delete a place
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) {
      return res
        .status(404)
        .json({ success: false, message: "Place not found" });
    }

    res.status(200).json({
      success: true,
      message: "Place deleted successfully",
      data: deletedPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du lieu",
      error,
    });
  }
};

// Mise à jour du profil utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil utilisateur",
      error,
    });
  }
};

// Récupération de tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Récupère tous les utilisateurs
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur", error });
  }
};

// Gestion de la modération des avis
exports.getAllReviews = async (req, res) => {
  try {
    console.log("[ADMIN COMMENTS] Starting to fetch reviews...");
    const startTime = Date.now();

    // Optimisation : récupérer seulement les places qui ont des reviews
    const places = await Place.find({ "reviews.0": { $exists: true } })
      .populate("reviews.user", "name")
      .populate("reviews.replies.user", "name")
      .select("reviews")
      .lean()
      .exec();
    
    console.log(`[ADMIN COMMENTS] Found ${places.length} places with reviews`);

    const allReviews = places.reduce(
      (acc, place) => [...acc, ...place.reviews],
      []
    );
    
    const endTime = Date.now();
    console.log(`[ADMIN COMMENTS] Reviews fetched in ${endTime - startTime}ms`);
    console.log(`[ADMIN COMMENTS] Total reviews: ${allReviews.length}`);

    res.status(200).json({ success: true, data: allReviews });
  } catch (error) {
    console.error("[ADMIN COMMENTS] Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur", error });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await Place.updateMany(
      {},
      { $pull: { reviews: { _id: reviewId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun avis trouvé avec cet ID",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Commentaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du commentaire",
      error,
    });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const result = await Place.updateOne(
      { "reviews._id": reviewId },
      { $pull: { "reviews.$.replies": { _id: replyId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune réponse trouvée avec cet ID",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Réponse supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réponse:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la réponse",
      error,
    });
  }
};

exports.approveOwner = async (req, res) => {
  console.log("[approveOwner] Route hit for ID:", req.params.id);
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    if (user.ownerStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Cette demande a déjà été traitée.",
      });
    }

    // Update user role and status
    user.role = 'owner';
    user.ownerStatus = 'approved';
    await user.save();

    res.status(200).json({
      success: true,
      message: "La demande de propriétaire a été approuvée avec succès.",
      user,
    });

  } catch (error) {
    console.error("[APPROVE OWNER] Erreur :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'approbation de la demande.",
    });
  }
};

exports.rejectOwner = async (req, res) => {
  console.log("[rejectOwner] Route hit for ID:", req.params.id);
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    if (user.ownerStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Cette demande a déjà été traitée.",
      });
    }

    user.ownerStatus = 'rejected';
    await user.save();

    res.status(200).json({
      success: true,
      message: "La demande de propriétaire a été rejetée avec succès.",
      user,
    });

  } catch (error) {
    console.error("[REJECT OWNER] Erreur :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors du rejet de la demande.",
    });
  }
};

exports.getPlacesByOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const places = await Place.find({ owner: id });
    res.status(200).json({
      success: true,
      data: places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des lieux.",
    });
  }
};

exports.getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await User.find({ ownerStatus: 'pending' });
    res.status(200).json({
      success: true,
      data: pendingOwners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des demandes.",
    });
  }
};
