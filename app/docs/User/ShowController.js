/**
 *  @api {get} /users/:id Show User
 *  @apiName GetUserShow
 *  @apiGroup Users
 *  @apiVersion 1.0.0
 *
 *  @apiParam {Uuid} id             ID of a User
 *
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *        "user": {
 *              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *             	"userName": "John Example",
 *   	        "firstName": "John",
 *   	        "lastName": "Example",
 *   	        "email": "John@example.com",
 *              "updatedAt": "2018-11-27T11:57:02.003Z",
 *              "createdAt": "2018-11-27T11:57:02.003Z"
 *        }
 *    }
 *   @apiError (404) Not Found    The User with <code>id</code> was not found.
 */
