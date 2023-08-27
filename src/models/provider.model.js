'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    static associate(models) {
      Provider.belongsToMany(models.Service, {
        through: models.Provider_Service,
        foreignKey: 'provider_id',
        otherKey: 'service_id'
      });
      Provider.hasMany(models.Provider_Service, { foreignKey: 'provider_id' });
      Provider.hasOne(models.Repair, { foreignKey: 'provider_id' });
      // Provider.belongsToMany(models.Equipment, {
      //   through: models.Maintenance,
      //   foreignKey: 'provider_id',
      //   otherKey: 'equipment_id'
      // });
    }
  }
  Provider.init({
    name: DataTypes.STRING,
    tax_code: DataTypes.STRING,
    note: DataTypes.TEXT,
    image: DataTypes.STRING,
    contact_person: DataTypes.STRING,
    email: DataTypes.STRING,
    hotline: DataTypes.STRING,
    address: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Provider',
  });
  return Provider;
};