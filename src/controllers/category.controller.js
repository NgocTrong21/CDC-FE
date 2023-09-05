const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");

//Equipment_Group Controller
exports.createGroup = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasGroup = await db.Equipment_Group.findOne({
        where: { name: req?.body?.name },
      });
      if (isHasGroup) return errorHandler(res, err.EQUIPMENT_GROUP_DUPLICATED);
      await db.Equipment_Group.create(req?.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listGroup = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let groups;
    if (page) {
      groups = await db.Equipment_Group.findAndCountAll({
        limit: limit,
        offset: page > 1 ? limit * (page - 1) : 0,
      });
    } else {
      groups = await db.Equipment_Group.findAll();
    }
    return successHandler(res, { groups }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detailGroup = async (req, res) => {
  try {
    let { id } = req?.query;
    const group = await db.Equipment_Group.findOne({ where: { id } });
    return successHandler(res, { group }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateGroup = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasGroup = await db.Equipment_Group.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasGroup) return errorHandler(res, err.EQUIPMENT_GROUP_NOT_FOUND);
      let isDuplicateGroup = await db.Equipment_Group.findOne({
        where: { name: req?.body?.name },
      });
      if (isDuplicateGroup)
        return errorHandler(res, err.EQUIPMENT_GROUP_DUPLICATED);
      await db.Equipment_Group.update(req.body, {
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasGroup = await db.Equipment_Group.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasGroup) return errorHandler(res, err.EQUIPMENT_GROUP_NOT_FOUND);
      await db.Equipment_Group.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.searchGroup = async (req, res) => {
  try {
    let { name } = req?.query;
    const groups = await db.Equipment_Group.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
    });
    return successHandler(res, { groups }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

//Equipment_Type Controller
exports.createType = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasGroup = await db.Equipment_Group.findOne({
        where: { id: req?.body?.group_id },
      });
      if (!isHasGroup) return errorHandler(res, err.EQUIPMENT_GROUP_NOT_FOUND);
      let isHasType = await db.Equipment_Type.findOne({
        where: {
          name: req?.body?.name,
          group_id: req?.body?.group_id,
        },
      });
      if (isHasType) return errorHandler(res, err.EQUIPMENT_TYPE_DUPLICATED);
      await db.Equipment_Type.create(req?.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listType = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let types;
    if (page) {
      types = await db.Equipment_Type.findAndCountAll({
        limit: limit,
        offset: page > 1 ? limit * (page - 1) : 0,
        include: [
          {
            model: db.Equipment_Group,
          },
        ],
        raw: false,
      });
    } else {
      types = await db.Equipment_Type.findAll();
    }
    return successHandler(res, { types }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listTypeBaseGroupId = async (req, res) => {
  try {
    let { group_id } = req?.query;
    let types = await db.Equipment_Type.findAll({ where: { group_id } });
    return successHandler(res, { types }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detailType = async (req, res) => {
  try {
    let { id } = req?.query;
    const type = await db.Equipment_Type.findOne({
      where: { id },
      include: [
        {
          model: db.Equipment_Group,
        },
      ],
      raw: false,
    });
    return successHandler(res, { type }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateType = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasType = await db.Equipment_Type.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasType) return errorHandler(res, err.EQUIPMENT_TYPE_NOT_FOUND);
      let isDuplicateType = await db.Equipment_Type.findOne({
        where: {
          name: req?.body?.name,
          group_id: req?.body?.group_id,
        },
      });
      if (isDuplicateType)
        return errorHandler(res, err.EQUIPMENT_TYPE_DUPLICATED);
      await db.Equipment_Type.update(req.body, {
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.deleteType = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasType = await db.Equipment_Type.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasType) return errorHandler(res, err.EQUIPMENT_TYPE_NOT_FOUND);
      await db.Equipment_Type.destroy({
        where: { id: req.body.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.searchType = async (req, res) => {
  try {
    let { name } = req?.query;
    const types = await db.Equipment_Type.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
      include: [
        {
          model: db.Equipment_Group,
        },
      ],
      raw: false,
    });
    return successHandler(res, { types }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

//Equipment_Unit Controller
exports.createUnit = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasUnit = await db.Equipment_Unit.findOne({
        where: { name: req?.body?.name },
      });
      if (isHasUnit) return errorHandler(res, err.EQUIPMENT_UNIT_DUPLICATED);
      await db.Equipment_Unit.create(req?.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listUnit = async (req, res) => {
  try {
    const units = await db.Equipment_Unit.findAll();
    return successHandler(res, { units }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detailUnit = async (req, res) => {
  try {
    let { id } = req?.query;
    const unit = await db.Equipment_Unit.findOne({ where: { id } });
    return successHandler(res, { unit }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateUnit = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasUnit = await db.Equipment_Unit.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasUnit) return errorHandler(res, err.EQUIPMENT_UNIT_NOT_FOUND);
      let isDuplicateUnit = await db.Equipment_Unit.findOne({
        where: { name: req?.body?.name },
      });
      if (isDuplicateUnit)
        return errorHandler(res, err.EQUIPMENT_UNIT_DUPLICATED);
      await db.Equipment_Unit.update(req.body, {
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasUnit = await db.Equipment_Unit.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasUnit) return errorHandler(res, err.EQUIPMENT_UNIT_NOT_FOUND);
      await db.Equipment_Unit.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.searchUnit = async (req, res) => {
  try {
    let { name } = req?.query;
    const units = await db.Equipment_Unit.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
    });
    return successHandler(res, { units }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

//Equipment_Status Controller
exports.createStatus = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasStatus = await db.Equipment_Status.findOne({
        where: { name: req?.body?.name },
      });
      if (isHasStatus)
        return errorHandler(res, err.EQUIPMENT_STATUS_DUPLICATED);
      await db.Equipment_Status.create(req?.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listStatus = async (req, res) => {
  try {
    const statuses = await db.Equipment_Status.findAll();
    return successHandler(res, { statuses }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detailStatus = async (req, res) => {
  try {
    let { id } = req?.query;
    const status = await db.Equipment_Status.findOne({ where: { id } });
    return successHandler(res, { status }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasStatus = await db.Equipment_Status.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasStatus)
        return errorHandler(res, err.EQUIPMENT_STATUS_NOT_FOUND);
      let isDuplicateStatus = await db.Equipment_Status.findOne({
        where: { name: req?.body?.name },
      });
      if (isDuplicateStatus)
        return errorHandler(res, err.EQUIPMENT_STATUS_DUPLICATED);
      await db.Equipment_Status.update(req.body, {
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.deleteStatus = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasStatus = await db.Equipment_Status.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasStatus)
        return errorHandler(res, err.EQUIPMENT_STATUS_NOT_FOUND);
      await db.Equipment_Status.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.searchStatus = async (req, res) => {
  try {
    let { name } = req?.query;
    const statuses = await db.Equipment_Status.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
    });
    return successHandler(res, { statuses }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

//Equipment_Risk_level
exports.createRiskLevel = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasRiskLevel = await db.Equipment_Risk_Level.findOne({
        where: { name: req?.body?.name },
      });
      if (isHasRiskLevel) return errorHandler(res, err.RISK_LEVEL_DUPLICATED);
      await db.Equipment_Risk_Level.create(req?.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listRiskLevel = async (req, res) => {
  try {
    const risk_levels = await db.Equipment_Risk_Level.findAll();
    return successHandler(res, { risk_levels }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detailRiskLevel = async (req, res) => {
  try {
    let { id } = req?.query;
    const risk_level = await db.Equipment_Risk_Level.findOne({ where: { id } });
    return successHandler(res, { risk_level }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateRiskLevel = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasRiskLevel = await db.Equipment_Risk_Level.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasRiskLevel) return errorHandler(res, err.RISK_LEVEL_NOT_FOUND);
      let isDuplicateRiskLevel = await db.Equipment_Risk_Level.findOne({
        where: { name: req?.body?.name },
      });
      if (isDuplicateRiskLevel)
        return errorHandler(res, err.RISK_LEVEL_DUPLICATED);
      await db.Equipment_Risk_Level.update(req.body, {
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.deleteRiskLevel = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasRiskLevel = await db.Equipment_Risk_Level.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasRiskLevel) return errorHandler(res, err.RISK_LEVEL_NOT_FOUND);
      await db.Equipment_Risk_Level.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.searchRiskLevel = async (req, res) => {
  try {
    let { name } = req?.query;
    const risk_levels = await db.Equipment_Risk_Level.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
    });
    return successHandler(res, { risk_levels }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.createAction = async (req, res) => {
  try {
    await db.Action.create(req.body);
    return successHandler(res, {}, 201);
  } catch (error) {
    return errorHandler(res, error);
  }
};

//Repair_Status
exports.createRepairStatus = async (req, res) => {
  try {
    await db.Repair_Status.create(req.body);
    return successHandler(res, {}, 201);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listRepairStatus = async (req, res) => {
  try {
    let repair_status = await db.Repair_Status.findAll();
    return successHandler(res, { repair_status }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

//Suplly_Type
exports.createSupllyType = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasType = await db.Supply_Type.findOne({
        where: { name: req?.body?.name },
      });
      if (isHasType) return errorHandler(res, err.SUPPLY_TYPE_DUPLICATED);
      await db.Supply_Type.create(req?.body, { transaction: t });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.listSupllyType = async (req, res) => {
  try {
    const supply_types = await db.Supply_Type.findAll();
    return successHandler(res, { supply_types }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detailSupllyType = async (req, res) => {
  try {
    let { id } = req?.query;
    const supply_type = await db.Supply_Type.findOne({ where: { id } });
    return successHandler(res, { supply_type }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateSupllyType = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasType = await db.Supply_Type.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasType) return errorHandler(res, err.SUPPLY_TYPE_NOT_FOUND);
      let isDuplicateType = await db.Supply_Type.findOne({
        where: { name: req?.body?.name },
      });
      if (isDuplicateType) return errorHandler(res, err.SUPPLY_TYPE_DUPLICATED);
      await db.Supply_Type.update(req.body, {
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.deleteSupllyType = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHasType = await db.Supply_Type.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHasType) return errorHandler(res, err.SUPPLY_TYPE_NOT_FOUND);
      await db.Supply_Type.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};
