const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Todo, {
                as: 'todos',
                foreignKey: 'userId',
                sourceKey: 'id'
            });
        }
    }

    User.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'already in use',
                    fields: [sequelize.fn('lower', sequelize.col('email'))]
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            defaultScope: {
                attributes: { exclude: ['password'] }
            },
            hooks: {
                beforeSave: (user, options) => {
                    if (options.fields.includes('password')) {
                        user.password = bcrypt.hashSync(user.password, 8);
                    }
                }
            },
            scopes: {}
        }
    );

    return User;
};
