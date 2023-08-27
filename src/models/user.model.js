'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id', targetKey: 'id' });
      User.belongsTo(models.Department, { foreignKey: 'department_id', targetKey: 'id' });
      User.hasOne(models.Department, { foreignKey: 'head_of_department_id', as: 'head'});
      User.hasOne(models.Department, { foreignKey: 'chief_nursing_id', as: 'nurse'});
      User.hasOne(models.Repair, { foreignKey: 'reporting_person_id', as: 'reporting_person' });
      User.hasOne(models.Repair, { foreignKey: 'schedule_create_user_id', as: 'schedule_create_user' });
      User.hasOne(models.Repair, { foreignKey: 'test_user_id', as: 'test_user' });
      User.hasOne(models.Handover, { foreignKey: 'handover_create_id', as: 'handover_create' });
      User.hasOne(models.Handover, { foreignKey: 'handover_in_charge_id', as: 'handover_in_charge' });
      User.hasOne(models.Liquidation, { foreignKey: 'create_user_id', as: 'create_user' });
      User.hasOne(models.Liquidation, { foreignKey: 'approver_id', as: 'approver' });
      User.hasOne(models.Transfer, { foreignKey: 'create_user_id', as: 'transfer_create_user' });
      User.hasOne(models.Transfer, { foreignKey: 'approver_id', as: 'transfer_approver' });
      User.hasOne(models.Inventory, { foreignKey: 'inventory_create_user_id', as: 'inventory_create_user' });
      User.hasOne(models.Inventory, { foreignKey: 'inventory_approve_user_id', as: 'inventory_approve_user' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    department_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER,
    active_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};