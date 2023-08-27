'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Action, { foreignKey: 'action_id', targetKey: 'id' });
      Notification.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id' });
      Notification.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
      Notification.belongsTo(models.Department, { foreignKey: 'department_id', targetKey: 'id' });
    }
  }
  Notification.init({
    action_id: DataTypes.INTEGER,
    equipment_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    department_id: DataTypes.INTEGER,
    is_seen: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};