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
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const user = await this.userRepository.findById(request.params.id);

        if (!user) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        return response.send(user);
    }
}

module.exports = ShowController;
