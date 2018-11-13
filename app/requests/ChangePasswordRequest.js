import { check, body, param, validationResult } from 'express-validator/check';

export default [
    param('token')
        .exists()
        .withMessage('is required'),

    body('password')
        .exists()
        .withMessage('is required'),

    body('password_confirmation')
        .exists()
        .withMessage('is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('must match password')
];
