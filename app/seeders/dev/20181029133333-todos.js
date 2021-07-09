const di = require('../../di');

const todoRepositories = di.get('repositories.todo');
const userRepositories = di.get('repositories.user');

const faker = require('faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = await userRepositories.findAll();

        for (let element of users) {
            await todoRepositories.create({
                name: faker.internet.domainWord(),
                completed: false,
                userId: element.id,
                creatorId: element.id
            });
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Todos');
    }
};
