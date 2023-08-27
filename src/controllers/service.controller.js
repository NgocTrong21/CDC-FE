const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    let service = await db.Service.create(req.body);
    successHandler(res, { service }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.list = async (req, res) => {
  try {
    let services = await db.Service.findAll({});
    successHandler(res, { services }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}