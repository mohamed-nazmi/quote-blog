const Quote = require('../models/quote');

exports.getQuotes = (req, res, next) => {
    Quote.find()
        .then(quotes => {
            res.status(200).json({
                quotes
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.addQuote = (req, res, next) => {
    const content = req.body.content;
    const quote = new Quote({
        content,
        author: 'frank-damon12',
        lovers: []
    });
    quote.save()
        .then(result => {
            res.status(201).json({
                quote
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.deleteQuote = (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.findByIdAndDelete(quoteId)
        .then(() => {
            res.status(200).json({});
        })
        .catch(err => {
            console.log(err);
        });
};