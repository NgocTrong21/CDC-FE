'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsToMany(models.Provider, {
        through: models.Provider_Service,
        foreignKey: 'service_id',
        otherKey: 'provider_id'
      })
    }
  }
  Service.init({
    name: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};