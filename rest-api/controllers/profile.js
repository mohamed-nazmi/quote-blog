const User = require('../models/user');

exports.getProfileInfoByUsername = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            if (!user) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }
            const profileInfo = {
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username
            };
            res.status(200).json({
                profileInfo
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};