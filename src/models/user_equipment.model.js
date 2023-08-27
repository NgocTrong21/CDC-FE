'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Equipment extends Model {
    static associate(models) {
      // User_Equipment.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id' });
      // User_Equipment.belongsTo(models.Equipment, { foreignKey: 'equipment_id', targetKey: 'id' });
    }
  }
  User_Equipment.init({
    user_id: DataTypes.INTEGER,
    equipment_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Equipment',
  });
  return User_Equipment;
};