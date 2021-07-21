/**
 *  @api {delete} /todos/:id Delete ToDo element
 *  @apiName DeleteToDoDestroy
 *  @apiGroup ToDo
 *  @apiVersion 1.0.0
 *
 *  @apiParam {Uuid} id             ID of a ToDo List element
 *
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 Content
 *
 *   @apiError NotFound     The <code>id</code> of the ToDo element was not found.
 *   @apiError Forbidden    ToDo element belongs to other User
 *   @apiError BadRequest   Validation error / invalid data
 */
