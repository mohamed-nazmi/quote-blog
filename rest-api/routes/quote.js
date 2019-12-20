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
    quoteController.addQuote
);

router.get('/quote/lovers/:quoteId', isAuth, quoteController.getQuoteLovers);

router.get('/quote/comments/:quoteId', isAuth, quoteController.getQuoteComments);

router.delete('/quote/:quoteId', isAuth, quoteController.deleteQuote);

router.post('/love-quote/:quoteId', isAuth, quoteController.loveQuote);

router.post('/unlove-quote/:quoteId', isAuth, quoteController.unloveQuote);

router.post(
    '/comment-quote/:quoteId',
    isAuth,
    [
        body('content', 'Comment through 18 characters')
            .not().isEmpty()
            .isLength({ max: 18 })
    ],
    quoteController.commentOnQuote
);

module.exports = router;