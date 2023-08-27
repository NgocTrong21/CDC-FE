'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsTo(models.Permission_Group, { foreignKey: 'group_id', targetKey: 'id', as: 'permissions' });
      Permission.belongsToMany(models.Role, {
        through: models.Role_Permission,
        foreignKey: 'permission_id',
        otherKey: 'role_id'
      });
      Permission.hasMany(models.Role_Permission, { foreignKey: 'permission_id' })
    }
  }
  Permission.init({
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    group_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};