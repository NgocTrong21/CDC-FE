'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventories', {
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
      inventory_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      inventory_create_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      inventory_approve_user_id: {
        type: Sequelize.INTEGER,
      },
      times: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
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
    await queryInterface.dropTable('Inventories');
  }
};