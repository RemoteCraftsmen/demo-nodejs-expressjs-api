const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models');

class DestroyController {
    //----------------------  To Destroy cont----------
    /**
     *  @api {delete} /users/:id Delete User
     *  @apiName DeleteUserDestroy
     *  @apiGroup Users
     *  @apiVersion 1.0.0
     *
     *  @apiParam {Number} id             ID of a ToDo List element
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     *   @apiError NotFound     The User with <code>id</code> was not found.
     *   @apiError Forbidden    Users can delete only themselfs
     *   @apiError BadRequest
     */

    async invoke(request, response, next) {
        const userId = request.params.id;

        User.findByPk(request.params.id).then(user => {
            if (!user) {
                return response.sendStatus(StatusCodes.NOT_FOUND);
            }

            if (user.id !== request.loggedUserId) {
                return response.sendStatus(StatusCodes.FORBIDDEN);
            }

            user.destroy()
                .then(() => {
                    response.sendStatus(StatusCodes.NO_CONTENT);
                })
                .catch(next);
        });
    }
}

module.exports = DestroyController;
