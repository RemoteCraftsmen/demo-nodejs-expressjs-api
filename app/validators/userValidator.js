const { check } = require('express-validator');

async function isMailTaken(email, di, userId) {
    const userRepository = di.get('repositories.user');

    const user = await userRepository.getByEmail(email);

    if (user && user.id !== userId) {
        return Promise.reject('already in use');
    }
}

const basic = [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('first name must have more than 2 characters'),

    check('userName')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('user name must have more than 2 characters'),

    check('lastName')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('last Name must have more than 2 characters'),

    check('password')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 8 })
        .withMessage('cannot have less than 8 characters'),

    check('email')
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

/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjI1NjU3MDQ2LCJleHAiOjE2MjU3NDM0NDZ9.klS1v10MjS4RkFeS3AhQUIbKrjP7WzZFubupBm1L-ms
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 2 })
        .withMessage('Last Name must have more than 2 characters'),

    check('birthDate')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isISO8601()
        .withMessage('Date must be in ISO8601 format(YYYY-MM-DD)')
        */
//];
/*
const withPassword = [
    check('password')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 8 })
        .withMessage('Password must have more than 8 characters')
];

const update = [
    ...basic,
    check('email')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isEmail()
        .withMessage('Mail not valid')
        .bail()
        .custom((email, { req }) =>
            isMailTaken(email, req.app.get('di'), req.params.id)
        )
];

const profile = [
    ...basic,
    ...withPassword,
    check('email')
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isEmail()
        .withMessage('Mail not valid')
        .bail()
        .custom((email, { req }) =>
            isMailTaken(email, req.app.get('di'), req.loggedUser.id)
        )
];
*/
//const store = [...update, ...withPassword];
//const store = [...basic];
//module.exports = { update, store, profile };
//module.exports = { store };
