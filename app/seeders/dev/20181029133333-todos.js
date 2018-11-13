// 'use strict';

const faker = require('faker');

const todos = [];

for (let i = 1; i <= 10; i++) {
    const todo = {
        name: faker.internet.domainWord,
        completed: false,
        user_id: i,
        creator_id: i,
        created_at: new Date(),
        updated_at: new Date()
    };

    todos.push(todo);
}

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Todos', todos);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Todos');
    }
};
