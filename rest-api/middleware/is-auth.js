const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'asupersuperlongsecretkey');
        User.findById(decodedToken.userId)
            .then(user => {
                req.user = user;
                next();
            })
    } catch(error) {
        res.status(401).json({
            message: 'Auth failed!'
        });
    }
};