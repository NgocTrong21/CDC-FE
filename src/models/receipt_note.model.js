"use strict";
// phiếu nhập
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receipt_Note extends Model {
    static associate(models) {
      Receipt_Note.belongsTo(models.Inbound_Order, {
        foreignKey: "inbound_order_id",
      });
      Receipt_Note.belongsTo(models.Order_Note_Status, {
        foreignKey: "status_id",
      });
    }
  }
  Receipt_Note.init(
    {
      person_in_charge: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Receipt_Note",
    }
  );
  return Receipt_Note;
};
