const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const roleRoute = require("./role.route");
const equipmentRoute = require("./equipment.route");
const equipmentHandoverRoute = require("./equipement_handover.route");
const equipmentRepairRoute = require("./equipment_repair.route");
const equipmentLiquidationRoute = require("./equipment_liquidation.route");
const equipmentTransferRoute = require("./equipment_transfer.route");
const equipmentMaintenanceRoute = require("./equipment_maintenance.route");
const equipmentInventoryRoute = require("./equipment_inventory.route");
const supplyAccompanyRoute = require("./supply_accompany.route");
const supplyRoute = require("./supply.route");
const permissionRoute = require("./permission.route");
const departmentRoute = require("./department.route");
const providerRoute = require("./provider.route");
const serviceRoute = require("./service.route");
const categoryRoute = require("./category.route");
const notificationRoute = require("./notification.route");
const userRoute = require("./user.route");
const docsRoute = require("./docs.route");
const equipmentInspectionRoute = require("./equipment_inspection.route");
const projectRoute = require("./project.route");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/role",
    route: roleRoute,
  },
  {
    path: "/permission",
    route: permissionRoute,
  },
  {
    path: "/equipment",
    route: equipmentRoute,
  },
  {
    path: "/equipment_handover",
    route: equipmentHandoverRoute,
  },
  {
    path: "/equipment_repair",
    route: equipmentRepairRoute,
  },
  {
    path: "/equipment_liquidation",
    route: equipmentLiquidationRoute,
  },
  {
    path: "/equipment_transfer",
    route: equipmentTransferRoute,
  },
  {
    path: "/equipment_inspection",
    route: equipmentInspectionRoute,
  },
  {
    path: "/equipment_maintenance",
    route: equipmentMaintenanceRoute,
  },
  {
    path: "/equipment_inventory",
    route: equipmentInventoryRoute,
  },
  {
    path: "/supplies",
    route: supplyRoute,
  },
  {
    path: "/department",
    route: departmentRoute,
  },
  {
    path: "/provider",
    route: providerRoute,
  },
  {
    path: "/service",
    route: serviceRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/project",
    route: projectRoute,
  },
  {
    path: "/supply_accompany",
    route: supplyAccompanyRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const env = "development";

/* istanbul ignore next */
if (env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
