'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Rental.belongsTo(models.Car, { as: 'car' });
      models.Rental.belongsTo(models.Customer, { as: 'customer' });
    }
  }
  Rental.init(
    {
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Car ID is required',
          },
          notEmpty: {
            msg: 'Car ID cannot be empty',
          },
          async isPresent(value) {
            const car = await sequelize.models.Car.findByPk(value);
            if (!car) {
              throw new Error(`Car with id: ${value} not found`);
            }
          },
        },
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Customer ID is required',
          },
          notEmpty: {
            msg: 'Customer ID cannot be empty',
          },
          async isPresent(value) {
            const customer = await sequelize.models.Customer.findByPk(value);
            if (!customer) {
              throw new Error(`Customer with id: ${value} not found`);
            }
          },
        },
      },
      expectedReturnDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Expected Return Date is required',
          },
          notEmpty: {
            msg: 'Expected Return Date cannot be empty',
          },
          isDate: {
            msg: 'Invalid Expected Return Date',
          },
        },
      },
      actualReturnDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('ONGOING', 'COMPLETED'),
        defaultValue: 'ONGOING',
        validate: {
          isIn: {
            args: [['ONGOING', 'COMPLETED']],
            msg: 'Illegal status, can only be one of ONGOING, COMPLETED',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Rental',
    },
  );
  return Rental;
};
