'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Repair extends Model {
    static associate(models) {
      Repair.belongsTo(models.User, { foreignKey: 'reporting_person_id', targetKey: 'id', as: 'reporting_user' });
      Repair.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
      Repair.belongsTo(models.Provider, { foreignKey: 'provider_id', targetKey: 'id' });
      Repair.belongsTo(models.Repair_Status, { foreignKey: 'repair_status', targetKey: 'id' });
      Repair.belongsTo(models.User, { foreignKey: 'schedule_create_user_id', targetKey: 'id', as: 'schedule_create_user' });
      Repair.belongsTo(models.User, { foreignKey: 'test_user_id', targetKey: 'id', as: 'test_user' });
    }
  }
  Repair.init({
    equipment_id: DataTypes.INTEGER,
    code: DataTypes.STRING,
    reason: DataTypes.TEXT,
    reporting_person_id: DataTypes.INTEGER,
    broken_report_date: DataTypes.DATE,
    provider_id: DataTypes.INTEGER,
    repair_priority: DataTypes.INTEGER,
    schedule_repair_date: DataTypes.DATE,
    repair_date: DataTypes.DATE,
    repair_status: DataTypes.INTEGER,
    estimated_repair_cost: DataTypes.DOUBLE,
    repair_completion_date: DataTypes.DATE,
    actual_repair_cost: DataTypes.DOUBLE,
    schedule_create_user_id: DataTypes.INTEGER,
    test_user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Repair',
  });
  return Repair;
};