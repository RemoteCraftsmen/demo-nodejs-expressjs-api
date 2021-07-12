const ResetPassword = require('../../emails/ResetPassword');
const { StatusCodes } = require('http-status-codes');
const { PasswordReset } = require('../../models');

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

    async invoke(request, response) {
        const { password } = request.body;
        const token = request.params.token;

        const passwordReset = await PasswordReset.getByToken(token);

        if (!passwordReset) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'Password reset token not found'
            });
        }

        if (passwordReset.hasExpired()) {
            return response.status(StatusCodes.BAD_REQUEST).json({
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
    }
}

module.exports = ChangePasswordController;
