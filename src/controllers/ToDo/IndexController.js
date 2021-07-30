class IndexController {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async invoke(request, response) {
        const { page = 1, perPage = 20 } = request.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const todos = await this.todoRepository.findAndCountAll({
            where: { userId: request.loggedUserId },
            limit: perPage,
            offset
        });

        return response.send(todos);
    }
}

module.exports = IndexController;
