const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');

const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    message,
  });

  res.status(201).json({
    message: 'Contact form submitted successfully',
    data: contactMessage,
  });
});

const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.status(200).json(messages);
});

const replyToMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  const message = await ContactMessage.findById(id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  message.reply = reply;
  message.isReplied = true;
  message.repliedAt = Date.now();

  await message.save();

  res.status(200).json({
    message: 'Reply sent successfully',
    data: message,
  });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await ContactMessage.findById(id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await ContactMessage.findByIdAndDelete(id);

  res.status(200).json({
    message: 'Message deleted successfully',
  });
});

module.exports = { submitContactForm, getContactMessages, replyToMessage, deleteMessage };