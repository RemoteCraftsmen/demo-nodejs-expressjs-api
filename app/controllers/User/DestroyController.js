const { StatusCodes } = require('http-status-codes');

class DestroyController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const {
            loggedUserId,
            params: { id: userId }
        } = request;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        if (user.id !== loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await user.destroy();

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = DestroyController;
