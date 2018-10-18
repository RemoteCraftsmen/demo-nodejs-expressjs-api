module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define(
        'Todo',
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            creator_id: {
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
            underscored: true,
            scopes: {}
        }
    );

    Todo.associate = models => {
        Todo.belongsTo(models.User, { as: 'user' });
        Todo.belongsTo(models.User, { as: 'creator', foreignKey: 'creator_id' });
    };

    return Todo;
};
