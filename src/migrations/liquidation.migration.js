'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Liquidations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      equipment_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      liquidation_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      create_user_id: {
        type: Sequelize.INTEGER,
      },
      approver_id: {
        type: Sequelize.INTEGER,
      },
      liquidation_status: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Liquidations');
  }
};