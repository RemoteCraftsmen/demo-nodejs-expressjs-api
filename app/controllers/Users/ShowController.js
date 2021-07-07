const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models');

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
    async invoke(request, response, next) {
        const userId = request.params.id;

        User.findByPk(userId)
            .then(user => {
                if (!user) {
                    return response.sendStatus(StatusCodes.NOT_FOUND);
                }

                response.json(user);
            })
            .catch(next);
    }
}

module.exports = ShowController;
