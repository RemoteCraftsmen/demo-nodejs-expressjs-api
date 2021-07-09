module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.createTable(
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
                creatorId: {
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
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Todos');
    }
};
