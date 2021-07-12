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
    constructor(userRepository, isValidUuidServices) {
        this.userRepository = userRepository;
        this.isValidUuidServices = isValidUuidServices;
    }

    async invoke(request, response) {
        if (!(await this.isValidUuidServices.handle(request.params.id))) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        const user = await this.userRepository.findById(request.params.id);

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
