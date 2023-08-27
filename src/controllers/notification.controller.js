const err = require("../errors/index");
const db = require("../models");
const { getList } = require("../utils/query.util");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");

exports.list = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let include = [
      { model: db.Action, attributes: ['id', 'name'] },
      { model: db.User, attributes: ['id', 'name'] },
      { model: db.Equipment, attributes: ['id', 'name'] },
      { model: db.Department, attributes: ['id', 'name'] },
    ];
    let notifications = await getList(limit, page, {}, 'Notification', include);
    return successHandler(res, { notifications }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Notification.destroy({
        where: { id: req?.body?.id },
        transaction: t
      });
      return successHandler(res, {}, 201);
    })
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.deleteAll = async (req, res) => {
  try {
    
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.update = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Notification.update(
        { is_seen: 1 },
        { 
          where: { id: req?.body?.id },
          transaction: t
        }
      )
    })
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}