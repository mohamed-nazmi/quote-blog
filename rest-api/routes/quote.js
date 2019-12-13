const express = require('express');
const { body } = require('express-validator');

const quoteController = require('../controllers/quote');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/quotes', quoteController.getQuotes);

router.get('/quotes/:username', quoteController.getQuotesByUsername);

router.post(
    '/quote',
    isAuth,
    [
        body('content', 'Quote through 120 characters')
            .not().isEmpty()
            .isLength({ max: 120 })
    ],
    quoteController.addQuote);

router.delete('/quote/:quoteId', isAuth, quoteController.deleteQuote);

module.exports = router;