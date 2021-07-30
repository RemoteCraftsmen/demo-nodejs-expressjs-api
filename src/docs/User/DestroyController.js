/**
 *    @api {delete} /users/:id Delete User
 *    @apiName DeleteUserDestroy
 *    @apiGroup Users
 *    @apiVersion 1.0.0
 *
 *    @apiParam {Uuid} id             ID of a ToDo List element
 *
 *    @apiSuccessExample Success-Response:
 *        HTTP/1.1 204 No Content
 *
 *    @apiError NotFound     The User with <code>id</code> was not found.
 *    @apiError Forbidden    Users can delete only themselfs
 *    @apiError BadRequest   Validation error / invalid data
 */
