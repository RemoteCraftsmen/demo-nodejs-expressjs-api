const { StatusCodes } = require('http-status-codes');

class UpdateController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const {
            loggedUserId,
            body: data,
            params: { id: userId }
        } = request;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        if (user.id !== loggedUserId) {
            return response.sendStatus(StatusCodes.FORBIDDEN);
        }

        await user.update(data);

        const updatedUser = await this.userRepository.findById(userId);

        return response.send(updatedUser);
    }
}

module.exports = UpdateController;
