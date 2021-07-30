const di = require('../../di');

const todoRepository = di.get('repositories.todo');
const userRepository = di.get('repositories.user');

const faker = require('faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await userRepository.findAll();

        await Promise.all(
            users.map(user =>
                todoRepository.create({
                    name: faker.internet.domainWord(),
                    completed: false,
                    userId: user.id,
                    createdBy: user.id
                })
            )
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Todos');
    }
};
