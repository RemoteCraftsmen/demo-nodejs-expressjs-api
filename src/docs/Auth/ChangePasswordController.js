/**
 *    @api {post} /reset-password/:token Reset password
 *    @apiName PostPasswordResetchangePassword
 *    @apiGroup ResetPassword
 *    @apiVersion 1.0.0
 *    @apiDescription If user already has recived email with token, he can send new password which will be hashed and stored in db
 *
 *    @apiParam {String} token Token which was send to users email, when asking for password reset
 *
 *    @apiParamExample {json} Request-Example:
 *        {
 *            "password": "12345678",
 *            "passwordConfirmation": "12345678"
 *        }
 *
 *    @apiError (400) BadRequest              Reset password token was not found <br />
 *                                            Password reset token expired
 *
 *    @apiError (500) InternalServerError     Errors in configuration
 */
