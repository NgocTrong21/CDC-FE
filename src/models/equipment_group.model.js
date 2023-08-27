'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment_Group extends Model {
    static associate(models) {
      Equipment_Group.hasOne(models.Equipment_Type, { foreignKey: 'group_id' });
    }
  }
  Equipment_Group.init({
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Equipment_Group',
  });
  return Equipment_Group;
};