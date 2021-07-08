const { body } = require('express-validator');

async function isMailTaken(email, di, userId) {
    const userRepository = di.get('repositories.user');

    const user = await userRepository.getByEmail(email);

    if (user && user.id !== userId) {
        return Promise.reject('already in use');
    }
}

const basic = [
    body('firstName')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('first name must have more than 2 characters'),

    body('userName')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('user name must have more than 2 characters'),

    body('lastName')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('last Name must have more than 2 characters'),

    body('password')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 8 })
        .withMessage('cannot have less than 8 characters'),

    body('email')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isEmail()
        .withMessage('is not valid')
        .bail()
        .custom((email, { req }) => isMailTaken(email, req.app.get('di')))
];
const store = [...basic];
module.exports = { store };
