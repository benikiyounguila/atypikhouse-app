const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reply: {
    type: String,
  },
  isReplied: {
    type: Boolean,
    default: false,
  },
  repliedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);