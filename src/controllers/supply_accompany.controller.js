const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    const supply_accompany = await db.Supply_Accompany.create(req.body);
    return successHandler(res, { supply_accompany }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.list = async (req, res) => {
  try {
    let { limit, page, name } = req?.query;
    let filter = {};

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
      };
    }
    let include = [{ model: db.Equipment, attributes: ["id", "name"] }];
    let supply_accompany = await getList(
      +limit,
      page,
      filter,
      "Supply_Accompany",
      include
    );

    return successHandler(
      res,
      { supply_accompany, count: supply_accompany.length },
      200
    );
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req?.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Supply_Accompany.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);

      await db.Supply_Accompany.update(data, {
        where: { id: data?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHas = await db.Supply_Accompany.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      await db.Supply_Accompany.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};
