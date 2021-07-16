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
        this.authService = auth;
    }

    async invoke(request, response) {
        const { email, password } = request.body;

        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            return response.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const userPassword = await this.userRepository.getPassword(user.id);

        if (
            !(await this.authService.comparePasswords(password, userPassword))
        ) {
            return response.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const token = this.authService.signIn(user);

        return response.send({ token, user });
    }
}

module.exports = LoginController;
