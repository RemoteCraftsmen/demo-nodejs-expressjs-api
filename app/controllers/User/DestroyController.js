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
    constructor(userRepository, isUUIDValidHandler) {
        this.userRepository = userRepository;
        this.isUUIDValidHandler = isUUIDValidHandler;
    }

    async invoke(request, response) {
        const {
            params: { id: userId }
        } = request;

        if (!this.isUUIDValidHandler.handle(userId)) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        if (user.id !== request.loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await user.destroy();

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = DestroyController;
