import {User, PasswordReset} from '../models';
import Mail from '../services/Mail';
import ResetPassword from '../emails/ResetPassword';

import {validationResult} from 'express-validator/check';

export default class PasswordResetController {

    /**
     *  @api {post} /reset-password Request for reset password
     *  @apiName PostPasswordResetresetPassword
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
     *   @apiError (404) NotFound                The User was not found.
     *   @apiError (500) InternalServerError     Errors in configuration
     */
    async resetPassword(request, response, next) {
        const {email} = request.body;

        const user = await User.getByEmail(email);

        if (!user) {
            return response.sendStatus(404);
        }

        new Mail()
            .send(
                ResetPassword({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    token: await PasswordReset.addToken(user)
                })
            )
            .then(() => {
                return response.sendStatus(200);
            })
            .catch(err => {
                console.error(err);
                return response.status(500).json({
                    error: 'Server Error'
                });
            });
    }

    /**
     *  @api {post} /reset-password/:token Reset password
     *  @apiName PostPasswordResetchangePassword
     *  @apiGroup ResetPassword
     *  @apiVersion 1.0.0
     *  @apiDescription If user already has recived email with token, he can send new password which will be hashed and stored in db
     *
     *  @apiParam {String} token Token which was send to users email, when asking for password reset
     *
     *  @apiParamExample {json} Request-Example:
     *    {
     *    	"password": "1",
     *    	"password_confirmation": "1"
     *    }
     *
     *   @apiError       BadRequest              Reset password token was not found </br>
     *                                           Password reset token expired
     *
     *   @apiError (500) InternalServerError     Errors in configuration
     */

    changePassword(request, response, next) {
        const validationErrors = validationResult(request);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(e => {
                return {message: e.msg, param: e.param};
            });

            return response.status(400).json({errors});
        }

        const {password} = request.body;
        const token = request.params.token;

        PasswordReset.getByToken(token)
            .then(async passwordReset => {
                if (!passwordReset) {
                    return response.status(400).json({
                        status: 'error',
                        message: 'Password reset token not found'
                    });
                }

                if (passwordReset.hasExpired()) {
                    return response.status(400).json({
                        status: 'error',
                        message: 'Password reset token expired'
                    });
                }

                await passwordReset.user.update({password});

                await passwordReset.destroy();

                return response.json({
                    status: 'success',
                    message: 'Password changed!'
                });
            })
            .catch(err => {
                console.error(err);
                return response.status(500).json({
                    error: 'Server Error'
                });
            });
    }
}
