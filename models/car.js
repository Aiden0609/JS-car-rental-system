'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Car.init({
    licensePlate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'License plate is required',
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
      },
    },
    dailyRate: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Daily rate is required',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'RENTED', 'MAINTAINING'),
      defaultValue: 'AVAILABLE',
      validate: {
        notIn: {
          args: [['AVAILABLE', 'RENTED', 'MAINTAINING']],
          msg: 'Illegal status, can only be one of AVAILABLE, RENTED, MAINTAINING',
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};