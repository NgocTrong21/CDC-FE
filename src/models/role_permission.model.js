'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_Permission extends Model {
    static associate(models) {
      Role_Permission.belongsTo(models.Role, { foreignKey: 'role_id', targetKey: 'id' });
      Role_Permission.belongsTo(models.Permission, { foreignKey: 'permission_id', targetKey: 'id' });
    }
  }
  Role_Permission.init({
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role_Permission',
  });
  return Role_Permission;
};