const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { sendHandoverEquipmentEmail } = require("../utils/sendEmail.util");
const { getList, getRoleEmailConfig } = require("../utils/query.util");
const { REPORT } = require("../enums");

exports.handoverEquipment = async (req, res) => {
  try {
    const data = req.body;
    const roles = await getRoleEmailConfig(REPORT.RECEIVE_HANDOVER);
    const users = await Promise.all(
      roles.map(async (role) => {
        const user = await db.User.findAll({
          where: {
            department_id: {
              [Op.or]: [1, +data?.department_id],
            },
            role_id: role.role_id,
          },
          attributes: ["id", "name", "email"],
        });
        return user;
      })
    );
    const user_equipment = data?.users_id.map((item) => {
      return {
        user_id: item,
        equipment_id: data?.equipment_id,
      };
    });
    if (data?.file) {
      const result = await cloudinary.uploader.upload(data?.file, {
        folder: "equipment_handover",
      });
      data.file = result?.secure_url;
    }
    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Handover.create(data, { transaction: t }),
        await db.User_Equipment.bulkCreate(user_equipment, { transaction: t }),
        await db.Equipment.update(
          {
            status_id: 3,
            department_id: data?.department_id,
          },
          {
            where: { id: data?.equipment_id },
            transaction: t,
          }
        ),
        await sendHandoverEquipmentEmail(req, data, users.flat()),
        await db.Notification.create(
          {
            user_id: data.handover_create_id,
            content: `Thiết bị ${data.name} đã được bàn giao đến ${data.department}`,
            is_seen: 0,
            equipment_id: data.equipment_id,
            report_id: 0,
          },
          { transaction: t }
        ),
      ]);
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.sendEmailHandoverReport = async (req, res) => {
  try {
    let data = req.body;
    let roles = await getRoleEmailConfig(1);
    let users = await Promise.all(
      roles.map(async (role) => {
        let user = await db.User.findAll({
          where: {
            department_id: {
              [Op.or]: [1, +data?.department_id],
            },
            role_id: role.role_id,
          },
          attributes: ["id", "name", "email"],
        });
        return user;
      })
    );
    await sendHandoverEquipmentEmail(data, users.flat());
    return successHandler(res, {}, 201);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.handoverEquipmentList = async (req, res) => {
  try {
    let { limit = 10 } = req?.query;
    let page = req?.query?.page;
    let name = req?.query?.name;
    let department_id = req?.query?.department_id;
    let handover_date = req?.query?.handover_date;

    let filter = {
      department_id,
      handover_date,
    };

    if (name) {
      filter = {
        ...filter,
        name: { [Op.like]: `%${name}%` },
      };
    }

    let include = [
      { model: db.Equipment, attributes: ["id", "name"] },
      { model: db.User, attributes: ["id", "name"] },
      { model: db.Department, attributes: ["id", "name"] },
    ];

    let equipments = await getList(limit, page, filter, "Handover", include);
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};

exports.getHandoverInfo = async (req, res) => {
  try {
    let { id } = req?.query;
    let handover_info = await db.Handover.findAll({
      where: { equipment_id: id },
      include: [
        { model: db.Equipment, attributes: ["id", "name", "model", "serial"] },
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "handover_in_charge",
        },
        { model: db.User, attributes: ["id", "name"], as: "handover_create" },
        { model: db.Department, attributes: ["id", "name"] },
      ],
      raw: false,
    });
    return successHandler(res, { handover_info }, 200);
  } catch (error) {
    debugger;
    console.log("___error___", error);
    return errorHandler(res, error);
  }
};
