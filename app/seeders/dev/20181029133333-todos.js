const di = require('../../di');

const todoRepositories = di.get('repositories.todo');
const userRepositories = di.get('repositories.user');

const faker = require('faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await userRepositories.findAll();

        await Promise.all(
            users.map(user =>
                todoRepositories.create({
                    name: faker.internet.domainWord(),
                    completed: false,
                    userId: user.id,
                    creatorId: user.id
                })
            )
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Todos');
    }
};
