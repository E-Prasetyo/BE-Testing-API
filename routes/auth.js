const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

const User = require('../models/user')

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please, fill valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(user => {
                    if (user) {
                        return Promise.reject('E-mail, is exist')
                    }
                })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.postSignUp
);


router.post('/login', authController.login);


router.get('/status', isAuth, authController.getStatus);

router.patch('/status', isAuth, authController.updateStatus);

module.exports = router
