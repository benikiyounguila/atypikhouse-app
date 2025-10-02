const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isLoggedIn, isAdminOrModerator } = require("../middlewares/user");

const upload = multer({ dest: "uploads/" });

const {
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
  getAllUsers,
  deleteUser,
  updateProfile,
  registerOwner,
  } = require("../controllers/userController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/google/login").post(googleLogin);
router.route("/register-owner").post(upload.none(), registerOwner);
router
  .route("/upload-picture")
  .post(isLoggedIn, upload.single("picture", 1), uploadPicture);
router.route("/update-user").put(updateUserDetails);
router.route("/logout").get(logout);
router.patch("/me", isLoggedIn, updateProfile);

// Ajout de la route pour récupérer tous les utilisateurs, accessible à l'admin et au modérateur
router.route("/").get(isLoggedIn, isAdminOrModerator, getAllUsers);

// Route pour supprimer un utilisateur
router.route("/:id").delete(isLoggedIn, deleteUser);

router.get('/test', (req, res) => {
  res.json({ message: 'OK' });
});

module.exports = router;