'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Todos',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                    autoIncrement: true
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                creatorId: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                completed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            },
            {
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Todos');
    }
};
