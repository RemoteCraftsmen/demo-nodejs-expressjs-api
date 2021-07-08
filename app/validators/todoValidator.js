const { body } = require('express-validator');

const create = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('first name must have more than 2 characters'),

    body('creatorId').optional(),

    body('userId').optional(),
    body('completed').optional()
];

module.exports = { create };
