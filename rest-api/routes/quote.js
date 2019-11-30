const express = require('express');

const quoteController = require('../controllers/quote');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/quotes', quoteController.getQuotes);

router.get('/quotes/:userId', quoteController.getQuotesByUserId);

router.post('/quote', isAuth, quoteController.addQuote);

router.delete('/quote/:quoteId', isAuth, quoteController.deleteQuote);

module.exports = router;