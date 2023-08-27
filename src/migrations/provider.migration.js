'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      tax_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING
      },
      contact_person: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      hotline: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Providers');
  }
};