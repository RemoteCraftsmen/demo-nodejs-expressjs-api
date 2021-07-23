const { StatusCodes } = require('http-status-codes');

class LoginController {
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
