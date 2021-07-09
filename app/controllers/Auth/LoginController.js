const { StatusCodes } = require('http-status-codes');

class LoginController {
    /**
     *  @api {post} /auth/login Attempt to log
     *  @apiName PostAuthLogin
     *  @apiGroup Auth
     *  @apiVersion 1.0.0
     *
     *  @apiParam {String} email Users email
     *  @apiParam {String} password Users password
     *
     *  @apiParamExample {json} Request-Example:
     *     {
     *       "authToken": ""
     *       "email": "test@test.com"
     *       "password": "123456"
     *     }
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "auth": true,
     *        "token": TOKEN GENERATED BY JWT,
     *        "user": {
     *            "id": 6,
     *            "username": "aaaa",
     *            "firstName": "aaaaa",
     *            "lastName": "aaaaa",
     *            "email": "test@test.com"
     *        }
     *    }
     *
     *  @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "auth": false,
     *       "token": null,
     *        "user": null
     *     }
     */
    constructor(userRepository, auth) {
        this.userRepository = userRepository;
        this.auth = auth;
        console.log(userRepository);
    }

    async invoke(request, response) {
        const { email, password } = request.body;

        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            return response
                .status(StatusCodes.UNAUTHORIZED)
                .send({ auth: false, token: null });
        }

        const userPassword = await this.userRepository.getPassword(user.id);

        if (!this.auth.comparePasswords(password, userPassword)) {
            return response
                .status(StatusCodes.UNAUTHORIZED)
                .send({ auth: false, token: null, user: null });
        }

        const token = this.auth.signIn(user);

        return response.send({ auth: true, token, user });
    }
}

module.exports = LoginController;
