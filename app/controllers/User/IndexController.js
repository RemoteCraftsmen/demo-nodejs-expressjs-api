class IndexController {
    /**
     *  @api {get} /users Read all Users
     *  @apiName GetUserIndex
     *  @apiGroup Users
     *  @apiVersion 1.0.0
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "users": [
     *            {
     *                "id": 1,
     *                "userName": "uname",
     *                "firstName": "fname",
     *                "lastName": "lname",
     *                "email": "me@me1543244202844.com",
     *                "createdAt": "2018-11-26T14:56:43.003Z",
     *                "updatedAt": "2018-11-26T14:56:43.003Z"
     *            }
     *        ]
     *    }
     *
     *   @apiSuccess {Number}      id
     *   @apiSuccess {String}      userName
     *   @apiSuccess {String}      firstName
     *   @apiSuccess {String}      lastName
     *   @apiSuccess {String}      email
     *   @apiSuccess {Timestamp}   updatedAt
     *   @apiSuccess {Timestamp}   createdAt
     *
     *   @apiError (400) BadRequest
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const users = await this.userRepository.findAll();

        return response.json({ users });
    }
}

module.exports = IndexController;
