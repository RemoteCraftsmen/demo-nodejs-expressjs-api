const ResetPassword = require('../../emails/ResetPassword');
const HttpStatus = require('http-status-codes');
const { User, PasswordReset } = require('../../models');
const { validationResult } = require('express-validator');

class ChangePasswordController {
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
     *   @apiError (400) BadRequest              Reset password token was not found </br>
     *                                           Password reset token expired
     *
     *   @apiError (500) InternalServerError     Errors in configuration
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async invoke(request, response, next) {
        const { password } = request.body;
        const token = request.params.token;

        PasswordReset.getByToken(token)
            .then(async passwordReset => {
                if (!passwordReset) {
                    return response.status(HttpStatus.BAD_REQUEST).json({
                        status: 'error',
                        message: 'Password reset token not found'
                    });
                }

                if (passwordReset.hasExpired()) {
                    return response.status(HttpStatus.BAD_REQUEST).json({
                        status: 'error',
                        message: 'Password reset token expired'
                    });
                }

                await passwordReset.user.update({ password });

                await passwordReset.destroy();

                return response.json({
                    status: 'success',
                    message: 'Password changed!'
                });
            })
            .catch(next);
    }
}

module.exports = ChangePasswordController;
