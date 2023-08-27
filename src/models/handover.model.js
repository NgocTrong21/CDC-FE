'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Handover extends Model {
    static associate(models) {
      Handover.belongsTo(models.User, { foreignKey: 'handover_in_charge_id', targetKey: 'id', as: 'handover_in_charge' });
      Handover.belongsTo(models.User, { foreignKey: 'handover_create_id', targetKey: 'id', as: 'handover_create' });
      Handover.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
      Handover.belongsTo(models.Department, { foreignKey: 'department_id', targetKey: 'id' });
    }
  }
  Handover.init({
    equipment_id: DataTypes.INTEGER,
    handover_date: DataTypes.DATE,
    note: DataTypes.TEXT,
    handover_in_charge_id: DataTypes.INTEGER,
    handover_create_id: DataTypes.INTEGER,
    department_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Handover',
  });
  return Handover;
};