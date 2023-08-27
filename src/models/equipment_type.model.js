'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment_Type extends Model {
    static associate(models) {
      Equipment_Type.hasOne(models.Equipment, { foreignKey: 'type_id' });
      Equipment_Type.belongsTo(models.Equipment_Group, { foreignKey: 'group_id', targetKey: 'id' });
    }
  }
  Equipment_Type.init({
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    group_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Equipment_Type',
  });
  return Equipment_Type;
};