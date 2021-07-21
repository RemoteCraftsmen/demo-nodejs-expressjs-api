/**
 *  @api {post} /todos Create ToDo element
 *  @apiName PostToDoStore
 *  @apiGroup ToDo
 *  @apiVersion 1.0.0
 *
 *  @apiParam {String} name             Name of that element, task
 *
 *  @apiParamExample {json} Request-Example:
 *    {
 *    	"name" : "test"
 *    }
 *
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *        "completed": false,
 *        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "name": "test",
 *        "creatorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "updatedAt": "2018-11-27T10:30:29.700Z",
 *        "createdAt": "2018-11-27T10:30:29.700Z"
 *    }
 *
 *   @apiSuccess {Uuid}      id Id of todo item
 *   @apiSuccess {Boolean}     completed Is task completed
 *   @apiSuccess {String}      name Name of Todo item
 *   @apiSuccess {Uuid}      creatorId Id of user that created task
 *   @apiSuccess {Uuid}      userId Id of user(owner)
 *   @apiSuccess {Timestamp}   updatedAt  Date of last update
 *   @apiSuccess {Timestamp}   createdAt Creation date
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *    {
 *        "errors": [
 *            {
 *                "message": "cannot be blank",
 *                "param": "name"
 *            }
 *        ]
 *    }
 */
