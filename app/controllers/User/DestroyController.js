const { StatusCodes } = require('http-status-codes');

class DestroyController {
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
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const {
            loggedUserId,
            params: { id: userId }
        } = request;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        if (user.id !== loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await user.destroy();

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = DestroyController;
