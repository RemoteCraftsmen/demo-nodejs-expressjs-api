'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Users',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                    autoIncrement: true
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                first_name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                last_name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            },
            {
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};
