const Mail = require('../../services/Mail');
const ResetPassword = require('../../emails/ResetPassword');
const { validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');
const { User, PasswordReset } = require('../../models');

class ResetPasswordController {
    //PasswordResetController.js
    /**
     *  @api {post} /reset-password Request for reset password
     *  @apiName PostPasswordResetPassword
     *  @apiGroup ResetPassword
     *  @apiVersion 1.0.0
     *
     *  @apiDescription User ask server to change his password, as respond he gets an email with token, which is giving access to this action
     *
     *  @apiParam {String} email Users email
     *
     *  @apiParamExample {json} Request-Example:
     *     {
     *       "email": "test@test.com"
     *     }
     *
     *   @apiError (404) NotFound                The User was not found
     *   @apiError (400) BadRequest              Email must be specified
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response, next) {
        try {
            validationResult(request).throw();
        } catch (err) {
            return next(err);
        }

        const { email } = request.body;

        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            return response.sendStatus(HttpStatus.NOT_FOUND);
        }
        //to do - fix this

        new Mail()
            .send(
                ResetPassword({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: await PasswordReset.addToken(user),
                    frontendUrl: request.get('origin')
                })
            )
            .then(() => {
                return response.sendStatus(HttpStatus.OK);
            })
            .catch(next);
    }
}

module.exports = ResetPasswordController;
