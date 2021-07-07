const { StatusCodes } = require('http-status-codes');
const { Todo } = require('../../models');

class DestroyController {
    /**
     *  @api {delete} /todos/:id Delete ToDo element
     *  @apiName DeleteToDoDestroy
     *  @apiGroup ToDo
     *  @apiVersion 1.0.0
     *
     *  @apiParam {Number} id             ID of a ToDo List element
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 Content
     *
     *   @apiError NotFound     The <code>id</code> of the ToDo element was not found.
     *   @apiError Forbidden    ToDo element belongs to other User
     *   @apiError BadRequest
     */

    async invoke(request, response, next) {
        const todoId = request.params.id;

        Todo.findByPk(todoId).then(todo => {
            if (!todo) {
                return response.sendStatus(StatusCodes.NOT_FOUND);
            }

            if (todo.userId !== request.loggedUserId) {
                return response.sendStatus(StatusCodes.FORBIDDEN);
            }

            todo.destroy()
                .then(() => {
                    response.sendStatus(StatusCodes.NO_CONTENT);
                })
                .catch(next);
        });
    }
}

module.exports = DestroyController;
