module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'PasswordResets',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID
                },
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false
                },
                token: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                validUntil: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW
                }
            },
            {
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('PasswordResets');
    }
};
