const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList, getRoleEmailConfig } = require("../utils/query.util");
const { sendLiquidationRequestEmail, sendLiquidationDoneEmail } = require("../utils/sendEmail.util");

exports.getListUnusedEquipment = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let name = req?.query?.name;
    let department_id = req?.query?.department_id;
    let status_id = 6;

    let filter = { department_id, status_id };
    for (let i in filter) {
      if (!filter[i]) {
        delete filter[i];
      }
    }
    if(name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { model: { [Op.like]: `%${name}%` } },
          { serial: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      }
    }

    let include = [
      { model: db.Department, attributes: ['id', 'name'] }
    ]
    let equipments = await getList(limit, page, filter, 'Equipment', include);
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.createLiquidationNote = async (req, res) => {
  try {
    let data = req?.body;
    let roles = await getRoleEmailConfig(9);
    let isHasEquipment = await db.Equipment.findOne({
      where: { id: data?.equipment_id }
    });
    if (!isHasEquipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
    let users = await Promise.all(roles.map(async role => {
      let user = await db.User.findAll({
        where: { 
          department_id: {
            [Op.or]: [1, +data?.department_id]
          },
          role_id: role.role_id
        },
        attributes: ['id', 'name', 'email']
      });
      return user;
    }))
    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Liquidation.create(data, { transaction: t }),
        await sendLiquidationRequestEmail(req, data, users.flat()),
      ])
      return successHandler(res, {}, 201);
    })
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getLiquidationDetail = async (req, res) => {
  try {
    let equipment = await db.Liquidation.findAll({
      where: { equipment_id: req?.query?.id },
      include: [
        { 
          model: db.Equipment, 
          attributes: ['id', 'name', 'model', 'serial', 'department_id'],
          include: [
            { model: db.Department, attributes: ['id', 'name'] }
          ],
          raw: false
        },
        { model: db.User, as: 'create_user', attributes: ['id', 'name'] },
        { model: db.User, as: 'approver', attributes: ['id', 'name'] },
      ],
      raw: false
    });
    return successHandler(res, { equipment }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.approveLiquidationNote = async (req, res) => {
  try {
    let data = req?.body;
    let roles = await getRoleEmailConfig(5);
    let isHasEquipment = await db.Equipment.findOne({
      where: { id: data?.equipment_id }
    });
    if (!isHasEquipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
    await db.sequelize.transaction(async (t) => {
      if(data?.liquidation_status === 1) {
        let users = await Promise.all(roles.map(async role => {
          let user = await db.User.findAll({
            where: { 
              department_id: {
                [Op.or]: [1, +data?.department_id]
              },
              role_id: role.role_id
            },
            attributes: ['id', 'name', 'email']
          });
          return user;
        }))

        await Promise.all([
          await db.Liquidation.update(data, { where: { equipment_id: data?.equipment_id }, transaction: t }),
          await db.Equipment.update({ status_id: 7 }, { where: { id: data?.equipment_id }, transaction: t }),
          await sendLiquidationDoneEmail(req, data, users.flat())
        ])
      } else {
        await db.Liquidation.update(data, { where: { equipment_id: data?.equipment_id }, transaction: t });
      }
      return successHandler(res, {}, 201);
    })
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}