const { validationResult } = require('express-validator');

const Quote = require('../models/quote');
const User = require('../models/user');

exports.getQuotes = (req, res, next) => {
    Quote.find()
        .then(quotes => {
            res.status(200).json({
                quotes: mapQuotesInResponse(quotes)
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getQuotesByUsername = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            return user.populate('quotes').execPopulate();
        })
        .then(user => {
            res.status(200).json({
                quotes: mapQuotesInResponse(user.quotes)
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.addQuote = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        throw error;
    }

    const content = req.body.content;
    const author = req.user;
    const signature = req.user.username;
    const lovers = [];

    const quote = new Quote({
        content,
        author,
        signature,
        lovers
    });

    quote.save()
        .then(quote => {
            req.user.quotes.unshift(quote);
            return req.user.save();
        })
        .then(() => {
            res.status(201).json({
                quote: mapOneQuoteInResponse(quote)
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getQuoteLovers = (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.findById(quoteId)
        .then(quote => {
            return quote.populate('lovers').execPopulate();
        })
        .then(quote => {
            let isLovedByUser = false;
            const loversInResponse = quote.lovers.map(lover => {
                if (!isLovedByUser && lover._id.toString() === req.user._id.toString()) {
                    isLovedByUser = true;
                }
                return { username: lover.username };
            });
            res.status(200).json({
                lovers: loversInResponse,
                isLovedByUser
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getQuoteComments = (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.findById(quoteId)
        .then(quote => {
            return quote.populate('comments.author').execPopulate();
        })
        .then(quote => {
            const commentsInResponse = quote.comments.map(comment => {
                return {
                    _id: comment.author._id.toString(),
                    username: comment.author.username,
                    content: comment.content
                };
            });
            res.status(200).json({
                comments: commentsInResponse
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteQuote = (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.deleteOne({ _id: quoteId, author: req.user })
        .then(result => {
            if (result.n === 0) {
                const error = new Error('Not authorized!');
                error.statusCode = 401;
                throw error;
            }
            req.user.quotes = req.user.quotes.filter(quote => quote._id.toString() !== quoteId);
            return req.user.save();
        })
        .then(() => {
            res.status(200).json({ message: 'Successful deletion!' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.loveQuote = (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.findById(quoteId)
        .then(quote => {
            if (quote.lovers.includes(req.user._id)) {
                const error = new Error('Already loved!');
                error.statusCode = 409;
                throw error;
            }
            quote.lovers.unshift(req.user);
            return quote.save();
        })
        .then(() => {
            res.status(201).json({
                lover: { username: req.user.username }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.unloveQuote = (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.findById(quoteId)
        .then(quote => {
            if (!quote.lovers.includes(req.user._id)) {
                const error = new Error('Already unloved!');
                error.statusCode = 409;
                throw error;
            }
            quote.lovers = quote.lovers.filter(lover => lover._id.toString() != req.user._id.toString());
            return quote.save();
        })
        .then(() => {
            res.status(201).json({
                unlover: { username: req.user.username }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.commentOnQuote = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        throw error;
    }

    const quoteId = req.params.quoteId;
    Quote.findById(quoteId)
        .then(quote => {
            const comment = {
                author: req.user,
                content: req.body.content
            };
            quote.comments.push(comment);
            return quote.save();
        })
        .then(() => {
            res.status(201).json({
                comment: {
                    _id: req.user._id.toString(),
                    username: req.user.username,
                    content: req.body.content
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

mapOneQuoteInResponse = quote => {
    const quoteInResponse = {
        _id: quote._id,
        content: quote.content,
        authorId: quote.author._id.toString(),
        signature: quote.signature,
        lovers: quote.lovers
    };
    return quoteInResponse
};

mapQuotesInResponse = quotes => {
    const quotesInResponse = quotes.map(quote => {
        return mapOneQuoteInResponse(quote);
    });
    return quotesInResponse;
};