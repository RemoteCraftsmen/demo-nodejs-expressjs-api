const { check } = require('express-validator');

const create = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('cannot be blank')
        .isLength({ min: 2 })
        .withMessage('first name must have more than 2 characters'),

    check('creatorId').optional(),

    check('userId').optional(),
    check('completed').optional()
];

module.exports = { create };
