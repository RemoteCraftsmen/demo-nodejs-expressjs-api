const { body } = require('express-validator');

const create = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required.')
        .isLength({ min: 2 })
        .withMessage('First name must have more than 2 characters.'),

    body('creatorId').optional(),

    body('userId').optional(),
    body('completed').optional()
];

module.exports = { create };
