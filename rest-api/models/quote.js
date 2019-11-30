const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quoteSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    lovers: {
        type: [Schema.Types.ObjectId],
        required: true
    }
});

module.exports = mongoose.model('Quote', quoteSchema);