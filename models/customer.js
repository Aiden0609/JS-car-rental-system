'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Customer.hasMany(models.Rental, { as: 'rentals' });
    }
  }
  Customer.init(
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Name is required',
          },
          notEmpty: {
            msg: 'Name cannot be empty',
          },
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Phone number is required',
          },
          notEmpty: {
            msg: 'Phone number cannot be empty',
          },
        },
      },
      driversLicense: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'Drivers license is required',
          },
          notEmpty: {
            msg: 'Drivers license cannot be empty',
          },
          async isUnique(value) {
            const customer = await Customer.findOne({ where: { driversLicense: value } });
            if (customer) {
              throw new Error('A customer with the same license already exist, please check');
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Customer',
    },
  );
  return Customer;
};
