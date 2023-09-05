import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from 'containers/Signin';
import Signup from 'containers/Signup';
import ResetPassword from 'containers/ResetPassword';
import Repair from 'containers/Equipment/Repair';
import NotFoundPage from 'containers/NotFoundPage';
import PrivateRoute from 'routes/PrivateRoute';
import Dashboard from 'containers/Dashboard';
import List from 'containers/Equipment/Action/List';
import Detail from 'containers/Equipment/Action/Detail';
import ImportOne from 'containers/Equipment/Action/ImportOne';
import ImportEquipmentByExcel from 'containers/Equipment/Action/ImportExcel';
import UpdateEquipment from 'containers/Equipment/Action/Update';
import Maintenance from 'containers/Equipment/Maintenance';
import Inspection from 'containers/Equipment/Inspection';
import Department from 'containers/Organization/Department';
import CreateDepartment from 'containers/Organization/Department/create';
import DetailDepartment from 'containers/Organization/Department/detail';
import Provider from 'containers/Organization/Provider';
import CreateProvider from 'containers/Organization/Provider/create';
import DetailProvider from 'containers/Organization/Provider/detail';
import User from 'containers/User';
import CreateUser from 'containers/User/create';
import DetailUser from 'containers/User/detail';
import EquipmentGroup from 'containers/Category/Equipment_Group';
import CreateEquipmentGroup from 'containers/Category/Equipment_Group/create';
import DetailEquipmentGroup from 'containers/Category/Equipment_Group/detail';
import EquipmentType from 'containers/Category/Equipment_Type';
import CreateEquipmentType from 'containers/Category/Equipment_Type/create';
import DetailEquipmentType from 'containers/Category/Equipment_Type/detail';
import EquipmentUnit from 'containers/Category/Equipment_Unit';
import CreateEquipmentUnit from 'containers/Category/Equipment_Unit/create';
import DetailEquipmentUnit from 'containers/Category/Equipment_Unit/detail';
import EquipmentStatus from 'containers/Category/Equipment_Status';
import CreateEquipmentStatus from 'containers/Category/Equipment_Status/create';
import DetailEquipmentStatus from 'containers/Category/Equipment_Status/detail';
import ActiveAccount from 'containers/ActiveAccount';
import SetRole from 'containers/Setting/SetRole';
import Notification from 'containers/Notification';
import UpdatePermission from 'containers/Setting/SetRole/update';
import StatisticByDepartment from 'containers/Equipment/Statistic/ByDepartment';
import StatisticByStatus from 'containers/Equipment/Statistic/ByStatus';
import StatisticByRiskLevel from 'containers/Equipment/Statistic/ByRiskLevel';
import StatisticByEquipmentType from 'containers/Equipment/Statistic/ByEquipmentType';
import StatisticByYear from 'containers/Equipment/Statistic/ByYear';
import CreateSchedule from 'containers/Equipment/Repair/CreateSchedule';
import HistoryRepair from 'containers/Equipment/Repair/HistoryRepair';
import UpdateSchedule from 'containers/Equipment/Repair/UpdateSchedule';
import Liquidation from 'containers/Equipment/Liquidation';
import Suplly from 'containers/Supply';
import SupplyCreate from 'containers/Supply/create';
import SupplyImportExcel from 'containers/Supply/ImportExcel';
import SupplyDetail from 'containers/Supply/detail';
import ImportSupply from 'containers/Equipment/Action/ImportSupply';
import ImportSupplies from 'containers/Equipment/Action/ImportSupplies';
import ListEqCorresponding from 'containers/Supply/ListEqCorresponding';
import Inventory from 'containers/Equipment/Inventory';
import { ToastContainer } from 'react-toastify';
import Transfer from 'containers/Equipment/Transfer';
import TransferDetail from 'containers/Equipment/Transfer/detail';
import EmailConfig from 'containers/Setting/Symtem/EmailConfig';
import Profile from 'containers/Profile';
import HistoryInventory from 'containers/Equipment/Inventory/HistoryInventory';
import ListEquipments from 'containers/Equipment/Inventory/ListEquipments';
import UpdateInventory from 'containers/Equipment/Inventory/UpdateInventory';
import HistoryInventoryEquipment from 'containers/Equipment/Inventory/HistoryInventoryEquipment';
import BrokenReport from 'containers/Equipment/Repair/BrokenReport';
import { permissions } from 'constants/permission.constant';
import ReactGA from 'react-ga';
import TagManager, { TagManagerArgs } from 'react-gtm-module';
import HistoryInspection from 'containers/Equipment/Inspection/HistoryInspection';
import DetailInspection from 'containers/Equipment/Inspection/DetailInspection';
import HistoryTransfer from 'containers/Equipment/Transfer/HistoryTransfer';
import HistoryLiquidation from 'containers/Equipment/Liquidation/HistoryLiquidation';
import DetailLiquidation from 'containers/Equipment/Liquidation/detail';

const TRACKING_ID = process.env.REACT_APP_TRACKING_ID || '';
ReactGA.initialize(TRACKING_ID);

const GTM_ID = process.env.REACT_APP_GTM_ID || '';
const tagManagerArgs: TagManagerArgs = {
  gtmId: GTM_ID,
};
TagManager.initialize(tagManagerArgs);

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Equipment Routes */}
          <Route
            path="/equipment/list_eq"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_READ}>
                <List />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/detail/:id"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_READ}>
                <Detail />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/update/:id"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_UPDATE}>
                <UpdateEquipment />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/import_one_eq"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_CREATE}>
                <ImportOne />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/import_excel_eq"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_CREATE}>
                <ImportEquipmentByExcel />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/import_supply/:id"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_CREATE}>
                <ImportSupply />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/import_supplies/:id"
            element={
              <PrivateRoute permission={permissions.EQUIPMENT_CREATE}>
                <ImportSupplies />
              </PrivateRoute>
            }
          />

          {/* Equipment Repair Routes */}
          <Route
            path="/equipment/repair/broken_report/:id/:repair_id"
            element={
              <PrivateRoute permission={permissions.REPORT_EQUIPMENT_READ}>
                <BrokenReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/repair"
            element={
              <PrivateRoute permission={permissions.REPAIR_EQUIPMENT_READ}>
                <Repair />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/repair/create_schedule/:id/:repair_id"
            element={
              <PrivateRoute permission={permissions.REPORT_EQUIPMENT_READ}>
                <CreateSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/repair/history/:id"
            element={
              <PrivateRoute permission={permissions.REPAIR_EQUIPMENT_READ}>
                <HistoryRepair />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/repair/update_schedule/:id/:repair_id"
            element={
              <PrivateRoute permission={permissions.REPORT_EQUIPMENT_READ}>
                <UpdateSchedule />
              </PrivateRoute>
            }
          />

          {/* Equipment Inspections Routes */}
          <Route
            path="/equipment/inspection"
            element={
              <PrivateRoute
                permission={permissions.ACCREDITATION_EQUIPMENT_READ}
              >
                <Inspection />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/inspection/detail/:id/:inspection_id"
            element={
              <PrivateRoute
                permission={permissions.ACCREDITATION_EQUIPMENT_READ}
              >
                <DetailInspection />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/inspection/history/:id/"
            element={
              <PrivateRoute
                permission={permissions.ACCREDITATION_EQUIPMENT_READ}
              >
                <HistoryInspection />
              </PrivateRoute>
            }
          />

          {/* Equipment Liquidation Routes */}
          <Route
            path="/equipment/liquidation"
            element={
              <PrivateRoute permission={permissions.LIQUIDATION_EQUIPMENT_READ}>
                <Liquidation />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/liquidation/detail/:id/:liquidation_id"
            element={
              <PrivateRoute permission={permissions.LIQUIDATION_EQUIPMENT_READ}>
                <DetailLiquidation />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/liquidation/history/:id/"
            element={
              <PrivateRoute permission={permissions.LIQUIDATION_EQUIPMENT_READ}>
                <HistoryLiquidation />
              </PrivateRoute>
            }
          />

          {/* Equipment Transfer Routes */}
          <Route
            path="/equipment/transfer"
            element={
              <PrivateRoute permission={permissions.TRANFER_EQUIPMENT_READ}>
                <Transfer />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/transfer/detail/:id/:transfer_id"
            element={
              <PrivateRoute permission={permissions.TRANFER_EQUIPMENT_READ}>
                <TransferDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/transfer/history/:id/"
            element={
              <PrivateRoute permission={permissions.TRANFER_EQUIPMENT_READ}>
                <HistoryTransfer />
              </PrivateRoute>
            }
          />
          {/* Equipment Inventory */}
          <Route
            path="/inventories/equipment"
            element={
              <PrivateRoute permission={permissions.INVENTORY_EQUIPMENT_READ}>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventories/history/:id"
            element={
              <PrivateRoute permission={permissions.INVENTORY_EQUIPMENT_READ}>
                <HistoryInventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventories/list_equipments/:id"
            element={
              <PrivateRoute permission={permissions.INVENTORY_EQUIPMENT_READ}>
                <ListEquipments />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventories/update/:id"
            element={
              <PrivateRoute permission={permissions.INVENTORY_EQUIPMENT_UPDATE}>
                <UpdateInventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventories/history_inventory_equipment/:id"
            element={
              <PrivateRoute permission={permissions.INVENTORY_EQUIPMENT_READ}>
                <HistoryInventoryEquipment />
              </PrivateRoute>
            }
          />

          {/* Equipment Maintainance */}
          <Route
            path="/equipment/maintenance"
            element={
              <PrivateRoute
                permission={permissions.MAINTAINANCE_EQUIPMENT_READ}
              >
                <Maintenance />
              </PrivateRoute>
            }
          />

          {/* Supply Routes */}
          <Route
            path="/supplies/list_sp"
            element={
              <PrivateRoute permission={permissions.IMPORT_SUPPLIES}>
                <Suplly />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/import_excel_sp"
            element={
              <PrivateRoute permission={permissions.IMPORT_SUPPLIES}>
                <SupplyImportExcel />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/detail/:id"
            element={
              <PrivateRoute permission={permissions.IMPORT_SUPPLIES}>
                <SupplyDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/create_sp"
            element={
              <PrivateRoute permission={permissions.IMPORT_SUPPLIES}>
                <SupplyCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/list_equipment_corresponding/:id"
            element={
              <PrivateRoute permission={permissions.IMPORT_SUPPLIES}>
                <ListEqCorresponding />
              </PrivateRoute>
            }
          />

          {/* Statistic Routes */}
          <Route
            path="/statistic/department"
            element={
              <PrivateRoute permission={permissions.STATISTIC_EQUIPMENT}>
                <StatisticByDepartment />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistic/status"
            element={
              <PrivateRoute permission={permissions.STATISTIC_EQUIPMENT}>
                <StatisticByStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistic/risk_level"
            element={
              <PrivateRoute permission={permissions.STATISTIC_EQUIPMENT}>
                <StatisticByRiskLevel />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistic/equipment_type"
            element={
              <PrivateRoute permission={permissions.STATISTIC_EQUIPMENT}>
                <StatisticByEquipmentType />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistic/year"
            element={
              <PrivateRoute permission={permissions.STATISTIC_EQUIPMENT}>
                <StatisticByYear />
              </PrivateRoute>
            }
          />

          {/* Organization Routes */}
          <Route
            path="/organization/department"
            element={
              <PrivateRoute permission={permissions.DEPARTMENT_READ}>
                <Department />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/department/create"
            element={
              <PrivateRoute permission={permissions.DEPARTMENT_CREATE}>
                <CreateDepartment />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/department/detail/:id"
            element={
              <PrivateRoute permission={permissions.DEPARTMENT_READ}>
                <DetailDepartment />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/provider"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <Provider />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/provider/create"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <CreateProvider />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/provider/detail/:id"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <DetailProvider />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/list_user"
            element={
              <PrivateRoute permission={permissions.USER_READ}>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/create_user"
            element={
              <PrivateRoute permission={permissions.USER_CREATE}>
                <CreateUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/detail/:id"
            element={
              <PrivateRoute permission={permissions.USER_READ}>
                <DetailUser />
              </PrivateRoute>
            }
          />

          {/* Profile Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Category Routes */}

          {/* Group */}
          <Route
            path="/category/group"
            element={
              <PrivateRoute permission={permissions.GROUP_EQUIPMENT_READ}>
                <EquipmentGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/group/create"
            element={
              <PrivateRoute permission={permissions.GROUP_EQUIPMENT_CREATE}>
                <CreateEquipmentGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/group/detail/:id"
            element={
              <PrivateRoute permission={permissions.GROUP_EQUIPMENT_READ}>
                <DetailEquipmentGroup />
              </PrivateRoute>
            }
          />

          {/* Type */}
          <Route
            path="/category/type"
            element={
              <PrivateRoute permission={permissions.TYPE_EQUIPMENT_READ}>
                <EquipmentType />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/type/create"
            element={
              <PrivateRoute permission={permissions.TYPE_EQUIPMENT_CREATE}>
                <CreateEquipmentType />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/type/detail/:id"
            element={
              <PrivateRoute permission={permissions.TYPE_EQUIPMENT_READ}>
                <DetailEquipmentType />
              </PrivateRoute>
            }
          />
          {/* <Route path="/category/type/import_by_excel" element={<PrivateRoute permission='a'><ImportEquipmentTypeByExcel /></PrivateRoute>} /> */}

          {/* Unit */}
          <Route
            path="/category/unit"
            element={
              <PrivateRoute permission={permissions.UNIT_EQUIPMENT_READ}>
                <EquipmentUnit />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/unit/create"
            element={
              <PrivateRoute permission={permissions.UNIT_EQUIPMENT_CREATE}>
                <CreateEquipmentUnit />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/unit/detail/:id"
            element={
              <PrivateRoute permission={permissions.UNIT_EQUIPMENT_READ}>
                <DetailEquipmentUnit />
              </PrivateRoute>
            }
          />

          {/* Status */}
          <Route
            path="/category/status"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <EquipmentStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/status/create"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <CreateEquipmentStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/status/detail/:id"
            element={
              <PrivateRoute permission={permissions.DASHBOARD_READ}>
                <DetailEquipmentStatus />
              </PrivateRoute>
            }
          />

          {/* Setting Routes */}
          <Route
            path="/setting/role"
            element={
              <PrivateRoute permission={permissions.SETTING_ROLE}>
                <SetRole />
              </PrivateRoute>
            }
          />
          <Route
            path="/setting/role/update/:role/:id"
            element={
              <PrivateRoute permission={permissions.SETTING_ROLE}>
                <UpdatePermission />
              </PrivateRoute>
            }
          />
          <Route
            path="/setting/notification"
            element={
              <PrivateRoute permission={permissions.SETTING_ROLE}>
                <Notification />
              </PrivateRoute>
            }
          />
          <Route
            path="/setting/email-config"
            element={
              <PrivateRoute permission={permissions.SETTING_ROLE}>
                <EmailConfig />
              </PrivateRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/active/:active_token" element={<ActiveAccount />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
