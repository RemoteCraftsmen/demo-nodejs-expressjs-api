const { StatusCodes } = require('http-status-codes');

class StoreController {
    /**
     *  @api {post} /users Create User
     *  @apiName PostUserStore
     *  @apiGroup Users
     *  @apiVersion 1.0.0
     *
     *  @apiParam {String} userName
     *  @apiParam {String} firstName
     *  @apiParam {String} lastName
     *  @apiParam {String} email
     *  @apiParam {String} password
     *
     *  @apiParamExample {json} Request-Example:
     *   {
     *   	"userName": "aaaa",
     *   	"firstName": "aaaaa",
     *   	"lastName": "aaaaa",
     *   	"email": "test123@test.com",
     *   	"password": "123456"
     *   }
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "auth": true,
     *        "token": TOKEN GENERATED BY JWT,
     *        "user": {
     *            "id": 6,
     *            "userName": "aaaa",
     *            "firstName": "aaaaa",
     *            "lastName": "aaaaa",
     *            "updatedAt": "2018-11-27T11:57:02.003Z",
     *            "createdAt": "2018-11-27T11:57:02.003Z"
     *        }
     *    }
     *
     *  @apiSuccess {Boolean}    auth
     *  @apiSuccess {String}     token
     *  @apiSuccess {Object}     user
     *
     *  @apiError (400) BadRequest
     *
     */
    constructor(userRepository, auth) {
        this.userRepository = userRepository;
        this.authService = auth;
    }

    async invoke(request, response) {
        const { body: userData } = request;
        const createdUser = await this.userRepository.create(userData);

        const user = await this.userRepository.findById(createdUser.id);

        return response.status(StatusCodes.CREATED).send(user);
    }
}

module.exports = StoreController;
