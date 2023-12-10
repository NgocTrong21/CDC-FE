"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Equipment", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      serial: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.TEXT,
      },
      unit_id: {
        type: Sequelize.INTEGER,
      },
      year_of_manufacture: {
        type: Sequelize.INTEGER,
      },
      year_in_use: {
        type: Sequelize.INTEGER,
      },
      initial_value: {
        type: Sequelize.FLOAT,
      },
      annual_depreciation: {
        type: Sequelize.FLOAT,
      },
      note: {
        type: Sequelize.TEXT,
      },
      status_id: {
        type: Sequelize.INTEGER,
      },
      manufacturing_country_id: {
        type: Sequelize.STRING,
      },
      department_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Equipment");
  },
};
