'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Liquidation extends Model {
    static associate(models) {
      Liquidation.belongsTo(models.User, { foreignKey: 'create_user_id', targetKey: 'id', as: 'create_user' });
      Liquidation.belongsTo(models.User, { foreignKey: 'approver_id', targetKey: 'id', as: 'approver' });
      Liquidation.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
    }
  }
  Liquidation.init({
    equipment_id: DataTypes.INTEGER,
    liquidation_date: DataTypes.DATE,
    note: DataTypes.TEXT,
    reason: DataTypes.TEXT,
    create_user_id: DataTypes.INTEGER,
    approver_id: DataTypes.INTEGER,
    liquidation_status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Liquidation',
  });
  return Liquidation;
};