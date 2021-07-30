const { StatusCodes } = require('http-status-codes');

class StoreController {
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
