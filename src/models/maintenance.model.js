'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maintenance extends Model {
    static associate(models) {
      // Maintenance.belongsTo(models.Provider, { foreignKey: 'provider_id', targetKey: 'id' });
      // Maintenance.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
    }
  }
  Maintenance.init({
    equipment_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    last_time: DataTypes.DATE,
    periodic_action: DataTypes.INTEGER,
    next_time: DataTypes.DATE,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Maintenance',
  });
  return Maintenance;
};