"use strict";
const { Model } = require("sequelize");
// phiếu xuất
module.exports = (sequelize, DataTypes) => {
  class Issuing_Note extends Model {
    static associate(models) {
      Issuing_Note.belongsTo(models.Outbound_Order, {
        foreignKey: "outbound_order_id",
      });
      Issuing_Note.belongsTo(models.Order_Note_Status, {
        foreignKey: "status_id",
      });
    }
  }
  Issuing_Note.init(
    {
      person_in_charge: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Issuing_Note",
    }
  );
  return Issuing_Note;
};
