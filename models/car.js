'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Car.hasMany(models.Rental, { as: 'rentals' });
    }
  }
  Car.init(
    {
      licensePlate: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'License plate is required',
          },
          notEmpty: {
            msg: 'License plate cannot be empty',
          },
          async isUnique(value) {
            const car = await Car.findOne({ where: { licensePlate: value } });
            if (car) {
              throw new Error('License plate already exist, please check');
            }
          },
        },
      },
      brand: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Brand is required',
          },
          notEmpty: {
            msg: 'Brand cannot be empty',
          },
        },
      },
      dailyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Daily rate is required',
          },
          isDecimal: {
            msg: 'Daily rate has to be a number',
          },
          min: {
            args: [[1]],
            msg: 'Daily rate must >= 1',
          },
        },
      },
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'RENTED', 'MAINTAINING'),
        defaultValue: 'AVAILABLE',
        validate: {
          isIn: {
            args: [['AVAILABLE', 'RENTED', 'MAINTAINING']],
            msg: 'Illegal status, can only be one of AVAILABLE, RENTED, MAINTAINING',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Car',
    },
  );
  return Car;
};
