'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider_Service extends Model {
    static associate(models) {
      Provider_Service.belongsTo(models.Provider, { foreignKey: 'provider_id', targetKey: 'id' });
      Provider_Service.belongsTo(models.Service, { foreignKey: 'service_id', targetKey: 'id' });
    }
  }
  Provider_Service.init({
    provider_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Provider_Service',
  });
  return Provider_Service;
};