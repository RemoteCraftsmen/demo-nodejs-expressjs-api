const { StatusCodes } = require('http-status-codes');

class RegisterController {
    constructor(userRepository, auth) {
        this.userRepository = userRepository;
        this.authService = auth;
    }

    async invoke(request, response) {
        const user = await this.userRepository.create(request.body);

        const token = await this.authService.signIn(user);

        return response.status(StatusCodes.CREATED).send({ token, user });
    }
}

module.exports = RegisterController;
