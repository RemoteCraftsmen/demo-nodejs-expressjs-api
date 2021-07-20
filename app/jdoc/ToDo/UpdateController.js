/**
 *  @api {put} /todos/:id Update ToDo element / Change completed state
 *  @apiName PutToDoPut
 *  @apiGroup ToDo
 *  @apiVersion 1.0.0
 *
 *  @apiDescription With this method we can  update elements.
 *
 *  @apiParam {Number} id
 *  @apiParam {String} name
 *
 * @apiSuccessExample {json} Success : Creating new element - only when :id does not exist in table
 *     HTTP/1.1 201 OK
 *    {
 *        "completed": false,
 *        "id": 5,
 *        "name": "krarkakrkar",
 *        "creatorId": 6,
 *        "userId": 6,
 *        "updatedAt": "2018-11-27T12:38:16.210Z",
 *        "createdAt": "2018-11-27T12:38:16.210Z"
 *    }
 *
 *  @apiError BadRequest    The <code>id</code> of the ToDo element was not found, <code>id</code> does not exist in table ToDo and parameter "name" is not specified
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
