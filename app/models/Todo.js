module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define(
        'Todo',
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            creatorId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            modelName: 'Todo',
            tableName: 'Todos',
            scopes: {}
        }
    );

    Todo.associate = models => {
        Todo.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            sourceKey: 'id'
        });
        Todo.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'creatorId'
        });
    };

    return Todo;
};
