'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      licensePlate: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      brand: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      dailyRate: {
        type: Sequelize.DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'RENTED', 'MAINTAINING'),
        defaultValue: 'AVAILABLE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cars');
  },
};
