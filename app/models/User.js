const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'cannot be blank'
                    }
                }
            },
            last_name: {
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
            underscored: true,
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

    User.associate = models => {
        User.hasMany(models.Todo, { as: 'todos' });
    };

    User.getByEmail = async (email, options = {}) => {
        return await User.findOne({ where: { email }, ...options });
    };

    User.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());

        delete values.password;
        return values;
    };

    return User;
};
