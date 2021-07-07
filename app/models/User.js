const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        async getByEmail(email, options = {}) {
            return await this.findOne({ where: { email }, ...options });
        }

        toJSON() {
            let values = Object.assign({}, this.get());

            delete values.password;

            return values;
        }

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
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'already in use',
                    fields: [sequelize.fn('lower', sequelize.col('email'))]
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: 'is not valid'
                    },
                    notNull: {
                        args: true,
                        msg: 'cannot be blank'
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        msg: 'cannot have less than 6 characters',
                        args: [6, 64]
                    },
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            }
        },
        {
            sequelize,
            tableName: 'Users',
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
