const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList, getRoleEmailConfig } = require("../utils/query.util");
const {
  sendTransferEmail,
  sendTransferApproveEmail,
} = require("../utils/sendEmail.util");

exports.transferEquipment = async (req, res) => {
  try {
    let data = req?.body;
    let roles = await getRoleEmailConfig(3);
    let isHasEquipment = await db.Equipment.findOne({
      where: { id: data?.equipment_id },
    });
    if (!isHasEquipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
    let users = await Promise.all(
      roles.map(async (role) => {
        let user = await db.User.findAll({
          where: {
            department_id: {
              [Op.or]: [1, +data?.to_department_id],
            },
            role_id: role.role_id,
          },
          attributes: ["id", "name", "email"],
        });
        return user;
      })
    );
    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Transfer.create(data, { transaction: t }),
        await sendTransferEmail(req, data, users.flat()),
      ]);
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.list = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let name = req?.query?.name;
    let filter = {};

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { model: { [Op.like]: `%${name}%` } },
          { serial: { [Op.like]: `%${name}%` } },
          { code: { [Op.like]: `%${name}%` } },
        ],
      };
    }

    let equipments = await db.Transfer.findAndCountAll({
      limit: limit,
      offset: page > 1 ? limit * (page - 1) : 0,
      include: [
        {
          model: db.Equipment,
          where: { ...filter },
          attributes: ["id", "name", "code", "model", "serial"],
        },
        {
          model: db.Department,
          attributes: ["id", "name"],
          as: "from_department",
        },
        {
          model: db.Department,
          attributes: ["id", "name"],
          as: "to_department",
        },
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "transfer_create_user",
        },
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "transfer_approver",
        },
      ],
      raw: false,
    });
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let equipment = await db.Transfer.findAll({
      where: { equipment_id: req?.query?.equipment_id },
      include: [
        {
          model: db.Equipment,
          attributes: ["id", "name", "code", "model", "serial"],
        },
        {
          model: db.Department,
          attributes: ["id", "name"],
          as: "from_department",
        },
        {
          model: db.Department,
          attributes: ["id", "name"],
          as: "to_department",
        },
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "transfer_create_user",
        },
        { model: db.User, attributes: ["id", "name"], as: "transfer_approver" },
      ],
      raw: false,
    });
    return successHandler(res, { equipment }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.approverTransfer = async (req, res) => {
  try {
    let data = req?.body;
    let isHasEquipment = await db.Equipment.findOne({
      where: { id: data?.equipment_id },
    });
    if (!isHasEquipment) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
    await db.sequelize.transaction(async (t) => {
      if (data?.transfer_status === 1) {
        let user = await db.User.findOne({
          where: { role_id: 6, department_id: data?.from_department_id },
          attributes: ["email"],
        });
        console.log("check user", {
          role_id: 6,
          department_id: data?.from_department_id,
        });
        await Promise.all([
          await db.Transfer.update(data, {
            where: { equipment_id: data?.equipment_id },
            transaction: t,
          }),
          await db.Equipment.update(
            { department_id: data?.to_department_id },
            { where: { id: data?.equipment_id }, transaction: t }
          ),
          await sendTransferApproveEmail(req, { ...data, email: user?.email }),
        ]);
      } else {
        await db.Transfer.update(data, {
          where: { equipment_id: data?.equipment_id },
          transaction: t,
        });
      }
    });
    return successHandler(res, {}, 201);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};
