/**
 *  @api {put} /todos/:id Update ToDo element
 *  @apiName PutToDoPut
 *  @apiGroup ToDo
 *  @apiVersion 1.0.0
 *
 *  @apiDescription With this method we can  update elements.
 *
 *  @apiParam {Uuid} id  Id od todo item
 *  @apiParam {String} name  Name of to do item
 *
 * @apiSuccessExample {json} Success :
 *     HTTP/1.1 201 OK
 *    {
 *        "completed": false,
 *        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "name": "Test Task",
 *        "creatorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *        "updatedAt": "2018-11-27T12:38:16.210Z",
 *        "createdAt": "2018-11-27T12:38:16.210Z"
 *    }
 *
 *  @apiError BadRequest    Validation error / invalid data
 *  @apiError Forbidden     ToDo element belongs to other User
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *
 *    {
 *        "errors": [
 *                {
 *                    "message": "cannot be blank",
 *                    "param": "name"
 *                }
 *            ]
 *    }
 */
