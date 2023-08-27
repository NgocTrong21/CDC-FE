'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailConfig extends Model {
    static associate(models) {
      EmailConfig.belongsTo(models.Role, { foreignKey: 'role_id', targetKey: 'id' });
    }
  }
  EmailConfig.init({
    role_id: DataTypes.INTEGER,
    check: DataTypes.INTEGER,
    action_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmailConfig',
  });
  return EmailConfig;
};