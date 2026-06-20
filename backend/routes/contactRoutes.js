const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');

router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], submitContact);

module.exports = router;