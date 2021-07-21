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
