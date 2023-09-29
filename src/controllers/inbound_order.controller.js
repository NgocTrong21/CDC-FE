const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    const { data, supplies } = req.body;
    let inbound_order;
    await db.sequelize.transaction(async (t) => {
      inbound_order = await db.Inbound_Order.create(
        { ...data, status_id: 1 },
        {
          transaction: t,
        }
      );

      for (const supply of supplies) {
        await db.Supply_Inbound_Order.create(
          {
            order_quantity: supply.order_quantity,
            defective_quantity: supply.defective_quantity,
            actual_quantity: supply.actual_quantity,
            inbound_order_id: inbound_order.id,
            supply_id: supply.id,
          },
          { transaction: t }
        );
      }
    });
    await db.Inbound_Order.update(
      { code: "CDC.000" + inbound_order.id },
      { where: { id: inbound_order.id } }
    );
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const inbound_order = await db.Inbound_Order.findOne({
      where: { id },
      include: [
        {
          model: db.Supply_Inbound_Order,
          attributes: [
            "id",
            "order_quantity",
            "defective_quantity",
            "actual_quantity",
          ],
          include: [
            {
              model: db.Supply,
              attributes: ["id", "name", "quantity", "unit_price"],
            },
          ],
        },
      ],
      raw: false,
    });
    return successHandler(res, { inbound_order }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const { data, supplies } = req.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Inbound_Order.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.INBOUND_ORDER_NOT_FOUND);
      await db.Inbound_Order.update(data, {
        where: { id: data?.id },
        transaction: t,
      });
      await db.Supply_Inbound_Order.destroy({
        where: { inbound_order_id: data?.id },
      });
      for (const supply of supplies) {
        await db.Supply_Inbound_Order.create(
          {
            order_quantity: supply.order_quantity,
            defective_quantity: supply.defective_quantity,
            actual_quantity: supply.actual_quantity,
            inbound_order_id: isHas.id,
            supply_id: supply.id,
          },
          { transaction: t }
        );
      }
    });

    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    const isHas = await db.Inbound_Order.findOne({
      where: { id: req.body.id },
    });
    if (!isHas) return errorHandler(res, err.INBOUND_ORDER_NOT_FOUND);
    await db.Supply_Inbound_Order.destroy({
      where: { inbound_order_id: req.body.id },
    });
    await db.Inbound_Order.destroy({
      where: { id: req.body.id },
    });
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let { limit, page, name, status_id, provider_id, warehouse_id } =
      req?.query;

    // const { isHasRole, department_id_from_token } = await checkRoleFromToken(
    //   req
    // );

    // if (!isHasRole) {
    //   department_id = department_id_from_token;
    // }

    let filter = {
      status_id,
      provider_id,
      warehouse_id,
    };

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [{ code: { [Op.like]: `%${name}%` } }],
      };
    }
    let include = [
      { model: db.Warehouse, attributes: ["id", "name"] },
      { model: db.Provider, attributes: ["id", "name"] },
      {
        model: db.Order_Note_Status,
        attributes: ["id", "name"],
      },
    ];
    let inbound_orders = await getList(
      +limit,
      page,
      filter,
      "Inbound_Order",
      include
    );
    return successHandler(
      res,
      { inbound_orders, count: inbound_orders.length },
      200
    );
  } catch (error) {
    return errorHandler(res, error);
  }
};
