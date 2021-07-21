/**
 *    @api {post} /users Create User
 *    @apiName PostUserStore
 *    @apiGroup Users
 *    @apiVersion 1.0.0
 *
 *    @apiParam {String} userName User name
 *    @apiParam {String} firstName User's first name
 *    @apiParam {String} lastName User's last name
 *    @apiParam {String} email Users email
 *    @apiParam {String} password Password (min 8 characters)
 *
 *    @apiParamExample {json} Request-Example:
 *        {
 * 	        "userName": "John Example",
 * 	        "firstName": "John",
 * 	        "lastName": "Example",
 * 	        "email": "John@example.com",
 * 	        "password": "12345678"
 *        }
 *
 *    @apiSuccessExample Success-Response:
 *        HTTP/1.1 200 OK
 *        {
 *            "user": {
 *                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *                "userName": "John Example",
 *                "firstName": "John",
 *                "lastName": "Example",
 *                "email": "John@example.com",
 *                "updatedAt": "2018-11-27T11:57:02.003Z",
 *                "createdAt": "2018-11-27T11:57:02.003Z"
 *            }
 *        }
 *
 *    @apiSuccess {Object}     user  Data of created user object
 *
 *    @apiError (400) BadRequest  Validation error / invalid data
 *
 */
