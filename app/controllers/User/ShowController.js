const { StatusCodes } = require('http-status-codes');

class ShowController {
    /**
     *  @api {get} /users/:id Show User
     *  @apiName GetUserShow
     *  @apiGroup Users
     *  @apiVersion 1.0.0
     *
     *  @apiParam {Number} id             ID of a User
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *       OK
     *
     *   @apiError (404) Not Found    The User with <code>id</code> was not found.
     */
    constructor(userRepository, isValidUuidServices) {
        this.userRepository = userRepository;
        this.isValidUuidServices = isValidUuidServices;
    }

    async invoke(request, response) {
        const {
            params: { id: userId }
        } = request;
        if (!(await this.isValidUuidServices.handle(userId))) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        return response.send(user);
    }
}

module.exports = ShowController;
