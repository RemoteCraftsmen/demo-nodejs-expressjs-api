const { StatusCodes } = require('http-status-codes');

class ShowController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const {
            params: { id: userId }
        } = request;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        return response.send(user);
    }
}

module.exports = ShowController;
