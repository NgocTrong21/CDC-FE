'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        through: models.Role_Permission,
        foreignKey: 'role_id',
        otherKey: 'permission_id'
      });
      Role.hasMany(models.Role_Permission, { foreignKey: 'role_id' })
      Role.hasOne(models.User, { foreignKey: 'role_id' });
      Role.hasOne(models.EmailConfig, { foreignKey: 'role_id' });
    }
  }
  Role.init({
    alias: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};