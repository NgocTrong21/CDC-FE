'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transfers', {
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
      transfer_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      note: {
        type: Sequelize.TEXT,
      },
      from_department_id: {
        type: Sequelize.INTEGER,
      },
      to_department_id: {
        type: Sequelize.INTEGER,
      },
      create_user_id: {
        type: Sequelize.INTEGER,
      },
      approver_id: {
        type: Sequelize.INTEGER,
      },
      transfer_status: {
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
    await queryInterface.dropTable('Transfers');
  }
};