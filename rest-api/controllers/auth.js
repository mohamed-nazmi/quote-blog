const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        throw error;
    }

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                firstname,
                lastname,
                username,
                email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(user => {
            const token = jwt.sign(
                { username: user.username, userId: user._id },
                'asupersuperlongsecretkey',
                { expiresIn: '1h' }
            );
            res.status(201).json({
                token: token,
                expiresIn: 3600,
                userId: user._id,
                username: user.username
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Access failed!');
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        throw error;
    }

    const loginInfo = req.body.loginInfo;
    const password = req.body.password;
    let fetchedUser;

    User.findOne({ $or: [ { email: loginInfo }, { username: loginInfo } ] })
        .then(user => {
            if (!user) {
                const error = new Error('Invalid login!');
                error.statusCode = 401;
                error.data = 'Invalid user or password.'
                throw error;
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Invalid login!');
                error.statusCode = 401;
                error.data = 'Invalid user or password.'
                throw error;
            }
            const token = jwt.sign(
                { username: fetchedUser.username, userId: fetchedUser._id },
                'asupersuperlongsecretkey',
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                username: fetchedUser.username
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};