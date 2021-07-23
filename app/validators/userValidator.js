const { body } = require('express-validator');

async function isMailTaken(email, di, userId) {
    const userRepository = di.get('repositories.user');

    const user = await userRepository.getByEmail(email);

    if (user && user.id !== userId) {
        return Promise.reject('Already in use.');
    }
}

const basic = [
    body('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required.')
        .isLength({ min: 2 })
        .withMessage('First name must have more than 2 characters.'),

    body('userName')
        .not()
        .isEmpty()
        .withMessage('User name is required.')
        .isLength({ min: 2 })
        .withMessage('User name must have more than 2 characters.'),

    body('lastName')
        .not()
        .isEmpty()
        .withMessage('Last name is required.')
        .isLength({ min: 2 })
        .withMessage('Last Name must have more than 2 characters.')
];

const withPassword = [
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 8 })
        .withMessage('Password should be longer than 8 characters.')
];

const update = [
    ...basic,
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Email is not valid.')
        .bail()
        .custom((email, { req }) =>
            isMailTaken(email, req.app.get('di'), req.params.id)
        )
];

const store = [
    ...basic,
    ...withPassword,
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Email is not valid.')
        .bail()
        .custom((email, { req }) => isMailTaken(email, req.app.get('di')))
];

module.exports = { store, update };
