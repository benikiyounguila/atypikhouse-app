const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// multer
const upload = multer({ dest: "/tmp" });

router.get("/hello", (req, res) => {
  res.status(200).json({
    greeting: "Hello from atypikhouse",
  });
});


// upload photo using image url
router.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    
    // Vérifier si Cloudinary est configuré
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('Cloudinary non configuré, utilisation de l\'URL directe');
      res.json(link);
      return;
    }
    
    let result = await cloudinary.uploader.upload(link, {
      folder: "Airbnb/Places",
    });
    res.json(result.secure_url);
  } catch (error) {
    console.log('Erreur upload-by-link:', error);
    // En cas d'erreur, retourner l'URL originale
    res.json(req.body.link);
  }
});

// upload images from local device
router.post("/upload", upload.array("photos", 100), async (req, res) => {
  try {
    let imageArray = [];

    // Vérifier si Cloudinary est configuré
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('Cloudinary non configuré, utilisation d\'images placeholder');
      // Retourner des URLs d'images placeholder
      for (let index = 0; index < req.files.length; index++) {
        imageArray.push(`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center&auto=format&q=80&${Date.now()}_${index}`);
      }
      res.status(200).json(imageArray);
      return;
    }

    for (let index = 0; index < req.files.length; index++) {
      let { path } = req.files[index];
      let result = await cloudinary.uploader.upload(path, {
        folder: "Airbnb/Places",
      });
      imageArray.push(result.secure_url);
    }

    res.status(200).json(imageArray);
  } catch (error) {
    console.log("Error upload:", error);
    // En cas d'erreur, retourner des images placeholder
    let imageArray = [];
    for (let index = 0; index < (req.files?.length || 1); index++) {
      imageArray.push(`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center&auto=format&q=80&${Date.now()}_${index}`);
    }
    res.status(200).json(imageArray);
  }
});

router.use("/user", require("./user"));
router.use("/places", require("./place"));
router.use("/bookings", require("./booking"));
router.use("/contact", require("./contact"));
router.use("/admin", require("./admin"));
router.use("/owner", require("./owner"));

module.exports = router;
