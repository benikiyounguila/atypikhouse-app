const User = require("../models/User");
const Booking = require("../models/Booking");
const Place = require("../models/Place");
const cookieToken = require("../utils/cookieToken");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

// Register/SignUp user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }
    
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');


    // check if user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already registered!",
      });
    }

    user = await User.create({
      firstName,
      lastName: lastName || firstName,
      email,
      password,
    });

    // after creating new user in DB send the token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: "Internal server Error",
      error: err,
    });
  }
};


exports.registerOwner = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      companyName,
      website,
      country,
      city,
      address,
      postalCode,
      accommodationType,
      numberOfProperties,
      howDidYouHear,
      siret,
    } = req.body;

    // Validation
    // ...

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un compte avec cet email existe déjà.",
      });
    }

    const { photos } = req.body;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "utilisateur",
      ownerStatus: 'pending',
      phoneNumber,
      companyName,
      website,
      country,
      city,
      address,
      postalCode,
      accommodationType,
      numberOfProperties,
      howDidYouHear,
      siret,
      photos: photos || [],
    });

    res.status(201).json({
      success: true,
      message: "Votre demande d'inscription en tant que propriétaire a été soumise avec succès. Elle est en attente d'approbation par un administrateur.",
      user: newUser,
    });

  } catch (error) {
    console.error("[REGISTER OWNER] Erreur :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la soumission de votre demande.",
    });
  }
};




// Login/SignIn user
exports.login = async (req, res) => {
  console.log("[LOGIN] req.body:", req.body);
  try {
    const { email, password } = req.body;

    // Validation rapide côté serveur
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis!",
      });
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide!",
      });
    }

    console.log(`[LOGIN] Attempting login for: ${email}`);

    // Recherche utilisateur optimisée (sans le mot de passe)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`[LOGIN] User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect!",
      });
    }

    // Vérification du mot de passe
    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      console.log(`[LOGIN] Invalid password for: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect!",
      });
    }

    // Génération du token
    const token = user.getJwtToken();
    
    // Préparation de la réponse (sans le mot de passe)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      role: user.role,
      isAdmin: user.isAdmin,
      balance: user.balance,
    };

    console.log(`[LOGIN] Login successful for: ${email}`);

    // Envoi de la réponse avec cookie ET JSON
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    };

    res.status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        message: "Connexion réussie",
        token,
        user: userResponse
      });

  } catch (err) {
    console.error('[LOGIN] Server error:', err);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return (
        res.status(400),
        json({
          message: "Name and email are required",
        })
      );
    }

    // check if user already registered
    let user = await User.findOne({ email });

    // If the user does not exist, create a new user in the DB
    if (!user) {
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      user = await User.create({
        firstName,
        lastName: lastName || firstName,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
    }

    // send the token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: "Internal server Error",
      error: err,
    });
  }
};

// Upload picture
exports.uploadPicture = async (req, res) => {
  const { path } = req.file;
  try {
    let result = await cloudinary.uploader.upload(path, {
      folder: "Airbnb/Users",
    });
    const user = await User.findByIdAndUpdate(req.user._id, { picture: result.secure_url }, { new: true });
    res.status(200).json({ success: true, url: result.secure_url, user });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal server error",
    });
  }
};

// update user
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return (
        res.status(404),
        json({
          message: "User not found",
        })
      );
    }

    // user can update only name, only password,only profile pic or all three

    user.name = name;
    if (picture && !password) {
      user.picture = picture;
    } else if (password && !picture) {
      user.password = password;
    } else {
      user.picture = picture;
      user.password = password;
    }
    const updatedUser = await user.save();
    cookieToken(updatedUser, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }, error);
  }
};

// PATCH /api/user/me : update profile (photo, nom, email)
exports.updateProfile = async (req, res) => {
  try {
    console.log('[UPDATE PROFILE] Request body:', req.body);
    console.log('[UPDATE PROFILE] User ID:', req.user._id);
    
    const userId = req.user._id;
    const { picture, name, email, password } = req.body;
    const update = {};
    
    if (picture) {
      console.log('[UPDATE PROFILE] Updating picture');
      update.picture = picture;
    }
    if (name) {
      console.log('[UPDATE PROFILE] Updating name to:', name);
      update.name = name;
    }
    if (email) {
      console.log('[UPDATE PROFILE] Validating email:', email);
      // Vérifier le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('[UPDATE PROFILE] Invalid email format');
        return res.status(400).json({ success: false, message: "Format d'email invalide." });
      }
      // Vérifier unicité
      const existing = await User.findOne({ email, _id: { $ne: userId } });
      if (existing) {
        console.log('[UPDATE PROFILE] Email already exists for another user');
        return res.status(400).json({ success: false, message: "Cet email est déjà utilisé par un autre compte." });
      }
      console.log('[UPDATE PROFILE] Email is valid and unique, updating');
      update.email = email;
    }
    if (password) {
      console.log('[UPDATE PROFILE] Hashing password');
      // Hash le mot de passe si fourni
      const bcrypt = require('bcryptjs');
      update.password = await bcrypt.hash(password, 10);
    }
    
    console.log('[UPDATE PROFILE] Final update object:', update);
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    console.log('[UPDATE PROFILE] User updated successfully:', user._id);
    res.json({ success: true, user });
  } catch (error) {
    console.error('[UPDATE PROFILE] Error:', error);
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du profil" });
  }
};

// Get all user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Récupérer tous les utilisateurs de la base de données
    res.status(200).json(users); // Répondre avec la liste des utilisateurs
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true, // Only send over HTTPS
    sameSite: "none", // Allow cross-origin requests
  });
  // Supprime la session côté serveur si elle existe
  if (req.session) {
    req.session = null;
  }
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete associated bookings
    await Booking.deleteMany({ user: id });

    // Delete owned places
    await Place.deleteMany({ owner: id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};


