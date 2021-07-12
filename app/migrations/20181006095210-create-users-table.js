module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Users',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID
                },
                userName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                firstName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                lastName: {
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
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                passwordResetToken: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                passwordResetTokenExpiresAt: {
                    allowNull: true,
                    type: Sequelize.DATE
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
