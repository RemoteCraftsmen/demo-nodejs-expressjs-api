const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static associate(models) {
            Todo.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId',
                sourceKey: 'id'
            });
            Todo.belongsTo(models.User, {
                as: 'creator',
                foreignKey: 'creatorId'
            });
        }
    }

    Todo.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            creatorId: {
                type: DataTypes.UUID,
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
            sequelize,
            scopes: {}
        }
    );
    return Todo;
};
