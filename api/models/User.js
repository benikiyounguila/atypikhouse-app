const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/rahul4019/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1695133265/pngwing.com_zi4cre.png",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["utilisateur", "modérateur", "admin", "owner"],
    default: "utilisateur",
  },
  balance: {
    type: Number,
    default: 0,
  },
  // Owner specific fields
  phoneNumber: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  companyName: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  website: {
    type: String,
  },
  country: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  city: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  address: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  postalCode: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  accommodationType: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  numberOfProperties: {
    type: Number,
    required: function() { return this.role === 'owner'; }
  },
  howDidYouHear: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  siret: {
    type: String,
    required: function() { return this.role === 'owner'; }
  },
  
  ownerStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  },
  photos: [{ type: String }], // New photos field
  
});

// encrypt password before saving it into the DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new or modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// validate the password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;