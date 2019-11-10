const express = require('express');

const quoteController = require('../controllers/quote');

const router = express.Router();

router.get('/quotes', quoteController.getQuotes);

router.post('/quote', quoteController.addQuote);

router.delete('/quote/:quoteId', quoteController.deleteQuote);

module.exports = router;