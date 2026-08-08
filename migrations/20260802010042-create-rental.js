'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rentals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      carId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      expectedReturnDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      actualReturnDate: {
        type: Sequelize.DATE,
      },
      totalCost: {
        type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        allowNull: false,
        defaultValue: 'ONGOING',
        type: Sequelize.ENUM('ONGOING', 'COMPLETED'),
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
    await queryInterface.dropTable('Rentals');
  },
};
