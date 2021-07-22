/**
 *    @api {get} /users Read all Users
 *    @apiName GetUserIndex
 *    @apiGroup Users
 *    @apiVersion 1.0.0
 *
 *    @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        {
 *            "users": [
 *                {
 *                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *                    "userName": "John Example",
 *                    "firstName": "John",
 *                    "lastName": "Example",
 *                    "email": "John@example.com",
 *                    "createdAt": "2018-11-26T14:56:43.003Z",
 *                    "updatedAt": "2018-11-26T14:56:43.003Z"
 *                }
 *            ]
 *        }
 *
 *    @apiSuccess {Uuid}      id Id of user
 *    @apiSuccess {String} userName User name
 *    @apiSuccess {String} firstName User's first name
 *    @apiSuccess {String} lastName User's last name
 *    @apiSuccess {String} email Users email
 *    @apiSuccess {Timestamp}   updatedAt  Date of last update
 *    @apiSuccess {Timestamp}   createdAt Creation date
 *
 *    @apiError (400) BadRequest Validation error / invalid data
 */
