module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Todos',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID
                },
                userId: {
                    type: Sequelize.UUID,
                    allowNull: true
                },
                createdBy: {
                    type: Sequelize.UUID,
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
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Todos');
    }
};
