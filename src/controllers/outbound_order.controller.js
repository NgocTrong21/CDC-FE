const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    const { data, supplies } = req.body;
    let outbound_order;
    await db.sequelize.transaction(async (t) => {
      outbound_order = await db.Outbound_Order.create(
        { ...data, status_id: 1 },
        {
          transaction: t,
        }
      );

      for (const supply of supplies) {
        await db.Supply_Outbound_Order.create(
          {
            ...supply,
            outbound_order_id: outbound_order.id,
          },
          { transaction: t }
        );
      }
    });
    await db.Outbound_Order.update(
      { code: "CDC.OO.000" + outbound_order.id },
      { where: { id: outbound_order.id } }
    );
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const outbound_order = await db.Outbound_Order.findOne({
      where: { id },
      include: [
        {
          model: db.Supply_Outbound_Order,
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
    return successHandler(res, { outbound_order }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const { data, supplies } = req.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Outbound_Order.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.ORDER_NOT_FOUND);
      await db.Outbound_Order.update(data, {
        where: { id: data?.id },
        transaction: t,
      });
      await db.Supply_Outbound_Order.destroy({
        where: { outbound_order_id: data?.id },
      });
      for (const supply of supplies) {
        await db.Supply_Outbound_Order.create(
          {
            ...supply,
            outbound_order_id: isHas.id,
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
    const isHas = await db.Outbound_Order.findOne({
      where: { id: req.body.id },
    });
    if (!isHas) return errorHandler(res, err.ORDER_NOT_FOUND);
    await db.Supply_Outbound_Order.destroy({
      where: { outbound_order_id: req.body.id },
    });
    await db.Outbound_Order.destroy({
      where: { id: req.body.id },
    });
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let { limit, page, name, status_id, customer_id, warehouse_id } =
      req?.query;

    // const { isHasRole, department_id_from_token } = await checkRoleFromToken(
    //   req
    // );

    // if (!isHasRole) {
    //   department_id = department_id_from_token;
    // }

    let filter = {
      status_id,
      customer_id,
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
      { model: db.Customer, attributes: ["id", "name"] },
      {
        model: db.Order_Note_Status,
        attributes: ["id", "name"],
      },
    ];
    let outbound_orders = await getList(
      +limit,
      page,
      filter,
      "Outbound_Order",
      include
    );
    return successHandler(
      res,
      { outbound_orders, count: outbound_orders.length },
      200
    );
  } catch (error) {
    return errorHandler(res, error);
  }
};
