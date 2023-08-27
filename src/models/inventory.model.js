'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      Inventory.belongsTo(models.User, { foreignKey: 'inventory_create_user_id', targetKey: 'id', as: 'inventory_create_user' });
      Inventory.belongsTo(models.User, { foreignKey: 'inventory_approve_user_id', targetKey: 'id', as: 'inventory_approve_user' });
      Inventory.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
    }
  }
  Inventory.init({
    equipment_id: DataTypes.INTEGER,
    inventory_date: DataTypes.DATE,
    note: DataTypes.TEXT,
    inventory_create_user_id: DataTypes.INTEGER,
    inventory_approve_user_id: DataTypes.INTEGER,
    times: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  return Inventory;
};