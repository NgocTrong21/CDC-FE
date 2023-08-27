'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    static associate(models) {
      Transfer.belongsTo(models.User, { foreignKey: 'create_user_id', targetKey: 'id', as: 'transfer_create_user' });
      Transfer.belongsTo(models.User, { foreignKey: 'approver_id', targetKey: 'id', as: 'transfer_approver' });
      Transfer.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
      Transfer.belongsTo(models.Department, { foreignKey: 'from_department_id', targetKey: 'id', as: 'from_department' });
      Transfer.belongsTo(models.Department, { foreignKey: 'to_department_id', targetKey: 'id', as: 'to_department' });
    }
  }
  Transfer.init({
    equipment_id: DataTypes.INTEGER,
    transfer_date: DataTypes.DATE,
    note: DataTypes.TEXT,
    from_department_id: DataTypes.INTEGER,
    to_department_id: DataTypes.INTEGER,
    create_user_id: DataTypes.INTEGER,
    approver_id: DataTypes.INTEGER,
    transfer_status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transfer',
  });
  return Transfer;
};