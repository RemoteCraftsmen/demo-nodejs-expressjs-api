class IndexController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const { page = 1, perPage = 20 } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const users = await this.userRepository.findAndCountAll({
            limit: perPage,
            offset
        });

        return response.send(users);
    }
}

module.exports = IndexController;
