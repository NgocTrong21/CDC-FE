const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { sendHandoverEquipmentEmail } = require("../utils/sendEmail.util");
const { getList, getRoleEmailConfig } = require("../utils/query.util");

exports.handoverEquipment = async (req, res) => {
  try {
    const data = req.body;
    await db.sequelize.transaction(async (t) => {
      let user_equipment = data?.users_id.map(item => {
        return {
          user_id: item,
          equipment_id: data?.equipment_id
        }
      })
      await Promise.all([
        await db.Handover.create(data, { transaction: t }),
        await db.User_Equipment.bulkCreate(user_equipment, { transaction: t }),
        await db.Equipment.update(
          {
            status_id: 3,
            department_id: data?.department_id
          },
          {
            where: { id: data?.equipment_id },
            transaction: t
          }
        ),
        await db.Notification.create(
          {
            action_id: 1,
            user_id: data?.handover_create_id,
            equipment_id: data?.equipment_id,
            department_id: data?.department_id,
            is_seen: 0
          },
          { transaction: t }
        )
      ])
      setTimeout(async () => {
        let equipment = await db.Handover.findOne({
          where: { equipment_id: data?.equipment_id },
          include: [
            { model: db.Equipment, attributes: ['id', 'name', 'model', 'serial'] },
            { model: db.User, attributes: ['id', 'name'], as: "handover_create" },
            { model: db.User, attributes: ['id', 'name'], as: "handover_in_charge" },
            { model: db.Department, attributes: ['id', 'name'] }
          ],
          raw: false
        })
        if (!equipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
        return successHandler(res, { equipment }, 201);
      }, 300)
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.sendEmailHandoverReport = async (req, res) => {
  try {
    let data = req.body;
    let roles = await getRoleEmailConfig(1);
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
    await sendHandoverEquipmentEmail(data, users.flat());
    return successHandler(res, {}, 201);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.handoverEquipmentList = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let name = req?.query?.name;
    let department_id = req?.query?.department_id;
    let handover_date = req?.query?.handover_date;

    let filter = {
      department_id,
      handover_date
    }

    if (name) {
      filter = {
        ...filter,
        name: { [Op.like]: `%${name}%` }
      }
    };

    let include = [
      { model: db.Equipment, attributes: ['id', 'name'] },
      { model: db.User, attributes: ['id', 'name'] },
      { model: db.Department, attributes: ['id', 'name'] },
    ]

    let equipments = await getList(limit, page, filter, 'Handover', include);
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}

exports.getHandoverInfo = async (req, res) => {
  try {
    let { id } = req?.query;
    let handover_info = await db.Handover.findAll({
      where: { equipment_id: id }, 
      include: [
        { model: db.Equipment, attributes: ['id', 'name', 'model', 'serial'] },
        { model: db.User, attributes: ['id', 'name'], as: 'handover_in_charge' },
        { model: db.User, attributes: ['id', 'name'], as: 'handover_create' },
        { model: db.Department, attributes: ['id', 'name'] },
      ],
      raw: false
    })
    return successHandler(res, { handover_info }, 200);
  } catch(error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
}


