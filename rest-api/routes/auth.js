const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post(
    '/signup',
    [
        body('firstname')
            .not().isEmpty().withMessage('First name is required.')
            .isLength({ min: 3, max: 12 }).withMessage('First name must range from 3-12 letters.')
            .custom((value, { req }) => {
                if (value.length > 0) {
                    const firstChar = value.charAt(0).toUpperCase();
                    if (!(firstChar >= 'A' && firstChar <= 'Z')) {
                        throw new Error('First name must start with a letter.');
                    }
                }
                if (value.indexOf(' ') >= 0) {
                    throw new Error('First name cannot contain spaces.');
                }
                return true;
            })
            .matches('^[a-zA-Z-]+$').withMessage('First name must contain only letters (and/or hyphens).'),

        body('lastname')
            .not().isEmpty().withMessage('Last name is required.')
            .isLength({ min: 3, max: 14 }).withMessage('Last name must range from 3-14 letters.')
            .custom((value, { req }) => {
                if (value.length > 0) {
                    const firstChar = value.charAt(0).toUpperCase();
                    if (!(firstChar >= 'A' && firstChar <= 'Z')) {
                        throw new Error('Last name must start with a letter.');
                    }
                }
                if (value.indexOf(' ') >= 0) {
                    throw new Error('Last name cannot contain spaces.');
                }
                return true;
            })
            .matches('^[a-zA-Z-]+$').withMessage('Last name must contain only letters (and/or hyphens).'),

        body('username')
            .not().isEmpty().withMessage('Username is required.')
            .isLength({ min: 6, max: 16 }).withMessage('Username must range from 6-16 characters.')
            .custom((value, { req }) => {
                if (value.length > 0) {
                    const firstChar = value.charAt(0).toUpperCase();
                    if (!(firstChar >= 'A' && firstChar <= 'Z')) {
                        throw new Error('Username must start with a letter.');
                    }
                }
                if (value.indexOf(' ') >= 0) {
                    throw new Error('Username cannot contain spaces.');
                }
                return User.findOne({ username: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Username is already taken.');
                        }
                    });
            })
            .matches('^[a-zA-Z0-9-_]+$').withMessage('Username must contain letters, numbers, hyphens, or underscores.'),

        body('email')
            .not().isEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Email is invalid.')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Email is already taken.');
                        }
                    })
            }),

        body('password')
            .not().isEmpty().withMessage('Password is required.')
            .isLength({ min: 8, max: 32 }).withMessage('Password must have 8-32 characters.'),

        body('confirmPassword')
            .not().isEmpty().withMessage('Confirm Password is required.')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords must match.')
                }
                return true;
            })
    ],
    authController.postSignup
);

router.post(
    '/login',
    [
        body('loginInfo')
            .not().isEmpty().withMessage('Email (or username) is required.'),

        body('password')
            .not().isEmpty().withMessage('Password is required.')
    ],
    authController.postLogin
);

module.exports = router;