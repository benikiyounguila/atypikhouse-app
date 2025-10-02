const express = require('express');
const router = express.Router();
const { submitContactForm, getContactMessages, replyToMessage, deleteMessage } = require('../controllers/contactController');

router.post('/', submitContactForm);
router.get('/', getContactMessages);
router.post('/:id/reply', replyToMessage);
router.delete('/:id', deleteMessage);

module.exports = router;