const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const { getRoleEmailConfig } = require("../utils/query.util");
const {
  sendInspectionEmail,
  sendHandleInspectionEmail,
} = require("../utils/sendEmail.util");
const cloudinary = require("../utils/cloudinary.util");
const { checkRoleFromToken } = require("../utils/auth.util");
const { REPORT } = require("../enums");

exports.getListInspectionEquipment = async (req, res) => {
  try {
    let { limit, page, status_id, department_id, type_id, name } = req?.query;
    const { isHasRole, department_id_from_token } = await checkRoleFromToken(
      req
    );

    if (!isHasRole) {
      department_id = department_id_from_token;
    }
    let filter = {
      department_id,
      status_id,
      type_id,
      regular_inspection: {
        [Op.ne]: 0,
      },
      [Op.or]: [{ status_id: 2 }, { status_id: 3 }],
    };
    for (let i in filter) {
      if (!filter[i]) {
        delete filter[i];
      }
    }
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

    const attributes = [
      "id",
      "name",
      "model",
      "serial",
      "code",
      "regular_inspection",
    ];

    const include = [
      { model: db.Department, attributes: ["id", "name"] },
      { model: db.Equipment_Status, attributes: ["id", "name"] },
      { model: db.Equipment_Type, attributes: ["id", "name"] },
      { model: db.Handover, attributes: ["handover_date"] },
      {
        model: db.Inspection,
        attributes: ["id", "inspection_date", "inspection_status"],
      },
    ];
    const equipments = await getList(
      +limit,
      page,
      filter,
      "Equipment",
      include,
      attributes
    );
    return successHandler(res, { equipments, count: equipments.length }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.inspectEquipment = async (req, res) => {
  try {
    const data = req?.body;
    data.code = `XXXX-${data?.equipment_id}-${new Date().getTime()}`;
    const roles = await getRoleEmailConfig(REPORT.RECEIVE_REQUEST_INSPECTION);
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
    if (data?.file) {
      const result = await cloudinary.uploader.upload(data?.file, {
        folder: "equipment_inspection",
      });
      data.file = result?.secure_url;
    }
    await db.sequelize.transaction(async (t) => {
      const inspection_data = await db.Inspection.create(data, {
        transaction: t,
      });
      const dataEmail = { ...data, id: inspection_data?.toJSON()?.id };
      await Promise.all([
        await sendInspectionEmail(req, dataEmail, users.flat()),
        await db.Notification.create(
          {
            user_id: data.inspection_create_user_id,
            content: `Phiếu kiểm định thiết bị ${data.name} thuộc ${data?.department} đã được tạo mới.`,
            is_seen: 0,
            equipment_id: data.equipment_id,
            report_id: dataEmail.id,
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

exports.detailInspection = async (req, res) => {
  try {
    const equipment = await db.Inspection.findOne({
      where: {
        id: req?.query?.inspection_id,
        equipment_id: req?.query?.id,
      },
      include: [
        {
          model: db.Equipment,
          attributes: ["id", "name", "model", "serial"],
          include: [{ model: db.Department, attributes: ["id", "name"] }],
          raw: false,
        },
        {
          model: db.User,
          as: "inspection_create_user",
          attributes: ["id", "name"],
        },
        {
          model: db.User,
          as: "inspection_approve_user",
          attributes: ["id", "name"],
        },
      ],
      raw: false,
    });
    return successHandler(res, { equipment }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.approveInspectionReport = async (req, res) => {
  try {
    const data = req.body;
    const roles = await getRoleEmailConfig(REPORT.RECEIVE_APPROVE_INSPECTION);
    let users;
    let content;
    if (data.inspection_status === 1) {
      users = await Promise.all(
        roles.map(async (role) => {
          const user = await db.User.findAll({
            where: {
              [Op.or]: [
                { id: data.inspection_create_user_id },
                {
                  department_id: {
                    [Op.or]: [1, +data?.department_id],
                  },
                  role_id: role.role_id,
                },
              ],
            },
            attributes: ["id", "name", "email"],
          });
          return user;
        })
      );
      content = `Phiếu kiểm định của thiết bị ${data.name} thuộc ${data.department} đã được phê duyệt.`;
    } else {
      users = await db.User.findAll({
        where: {
          id: data.inspection_create_user_id,
        },
        attributes: ["id", "name", "email"],
      });
      content = `Phiếu kiểm định của thiết bị ${data.name} thuộc ${data.department} đã bị từ chối.`;
    }

    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Inspection.update(data, {
          where: { equipment_id: data?.equipment_id, id: data?.id },
          transaction: t,
        }),
        await sendHandleInspectionEmail(req, data, users.flat()),
        await db.Notification.create(
          {
            user_id: data.inspection_approve_user_id,
            content,
            is_seen: 0,
            equipment_id: data.equipment_id,
            report_id: data.id,
          },
          { transaction: t }
        ),
      ]);
    });
    return successHandler(res, {}, 201);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.updateInspectionReport = async (req, res) => {
  try {
    const data = req?.body;
    const roles = await getRoleEmailConfig(REPORT.RECEIVE_REQUEST_INSPECTION);
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
    if (data?.file) {
      const result = await cloudinary.uploader.upload(data?.file, {
        folder: "equipment_inspection",
      });
      data.file = result?.secure_url;
    }
    await db.sequelize.transaction(async (t) => {
      await Promise.all([
        await db.Inspection.update(data, {
          where: { equipment_id: data?.equipment_id, id: data?.id },
          transaction: t,
        }),
        await sendInspectionEmail(req, data, users.flat()),
        await db.Notification.create(
          {
            user_id: data.inspection_create_user_id,
            content: `Phiếu kiểm định thiết bị ${data.name} thuộc ${data?.department} đã được cập nhật.`,
            is_seen: 0,
            equipment_id: data.equipment_id,
            report_id: data.id,
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

exports.getHistoryInspection = async (req, res) => {
  try {
    const { id } = req?.query;
    const inspection = await db.Inspection.findAll({
      where: { equipment_id: id, inspection_status: 1 },
      include: [
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "inspection_create_user",
        },
        {
          model: db.User,
          attributes: ["id", "name"],
          as: "inspection_approve_user",
        },
        {
          model: db.Provider,
          attributes: ["id", "name"],
        },
      ],
      raw: false,
    });
    return successHandler(res, { inspection }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
