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
import Accreditation from 'containers/Equipment/Accreditation';
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
import LiquidationDetail from 'containers/Equipment/Liquidation/detail';
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

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute permission='dashboard.read'><Dashboard /></PrivateRoute>} />

          {/* Equipment Routes */}
          <Route path="/equipment/list_eq" element={<PrivateRoute permission='equipment.read'><List /></PrivateRoute>} />
          <Route path="/equipment/detail/:id" element={<PrivateRoute permission='equipment.read'><Detail /></PrivateRoute>} />
          <Route path="/equipment/update/:id" element={<PrivateRoute permission='equipment.update'><UpdateEquipment /></PrivateRoute>} />
          <Route path="/equipment/import_one_eq" element={<PrivateRoute permission='equipment.create'><ImportOne /></PrivateRoute>} />
          <Route path="/equipment/import_excel_eq" element={<PrivateRoute permission='equipment.create'><ImportEquipmentByExcel /></PrivateRoute>} />
          <Route path="/equipment/import_supply/:id" element={<PrivateRoute permission='equipment.create'><ImportSupply /></PrivateRoute>} />
          <Route path="/equipment/import_supplies/:id" element={<PrivateRoute permission='equipment.create'><ImportSupplies /></PrivateRoute>} />

          {/* Equipment Repair Routes */}
          <Route path="/equipment/repair" element={<PrivateRoute permission='repair_equipment.read'><Repair /></PrivateRoute>} />
          <Route path="/equipment/repair/create_schedule/:id/:repair_id" element={<PrivateRoute permission='repair_equipment.create'><CreateSchedule /></PrivateRoute>} />
          <Route path="/equipment/repair/history/:id" element={<PrivateRoute permission='repair_equipment.read'><HistoryRepair /></PrivateRoute>} />
          <Route path="/equipment/repair/update_schedule/:id/:repair_id" element={<PrivateRoute permission='repair_equipment.update'><UpdateSchedule /></PrivateRoute>} />

          {/* Equipment Liquidation Routes */}
          <Route path="/equipment/liquidation" element={<PrivateRoute permission='liquidation_equipment.read'><Liquidation /></PrivateRoute>} />
          <Route path="/equipment/liquidation_detail/:id" element={<PrivateRoute permission='liquidation_equipment.update'><LiquidationDetail /></PrivateRoute>} />
          
          {/* Equipment Transfer Routes */}
          <Route path="/equipment/transfer" element={<PrivateRoute permission='tranfer_equipment.read'><Transfer /></PrivateRoute>} />
          <Route path="/equipment/transfer_detail/:id" element={<PrivateRoute permission='tranfer_equipment.update'><TransferDetail /></PrivateRoute>} />

          {/* Equipment Inventory */}
          <Route path="/inventories/equipment" element={<PrivateRoute permission='dashboard.read'><Inventory /></PrivateRoute>} />
          <Route path="/inventories/history/:id" element={<PrivateRoute permission='dashboard.read'><HistoryInventory /></PrivateRoute>} />
          <Route path="/inventories/list_equipments/:id" element={<PrivateRoute permission='dashboard.read'><ListEquipments /></PrivateRoute>} />
          <Route path="/inventories/update/:id" element={<PrivateRoute permission='dashboard.read'><UpdateInventory /></PrivateRoute>} />
          <Route path="/inventories/history_inventory_equipment/:id" element={<PrivateRoute permission='dashboard.read'><HistoryInventoryEquipment /></PrivateRoute>} />

          {/* Equipment Maintainance */}
          <Route path="/equipment/maintenance" element={<PrivateRoute permission='dashboard.read'><Maintenance /></PrivateRoute>} />
          <Route path="/equipment/accreditation" element={<PrivateRoute permission='dashboard.read'><Accreditation /></PrivateRoute>} />

          {/* Supply Routes */}
          <Route path="/supplies/list_sp" element={<PrivateRoute permission='import_supplies'><Suplly /></PrivateRoute>} />
          <Route path="/supplies/import_excel_sp" element={<PrivateRoute permission='import_supplies'><SupplyImportExcel /></PrivateRoute>} />
          <Route path="/supplies/detail/:id" element={<PrivateRoute permission='import_supplies'><SupplyDetail /></PrivateRoute>} />
          <Route path="/supplies/create_sp" element={<PrivateRoute permission='import_supplies'><SupplyCreate /></PrivateRoute>} />
          <Route path="/supplies/list_equipment_corresponding/:id" element={<PrivateRoute permission='import_supplies'><ListEqCorresponding /></PrivateRoute>} />

          {/* Statistic Routes */}
          <Route path="/statistic/department" element={<PrivateRoute permission='statistic_equipment'><StatisticByDepartment /></PrivateRoute>} />
          <Route path="/statistic/status" element={<PrivateRoute permission='statistic_equipment'><StatisticByStatus /></PrivateRoute>} />
          <Route path="/statistic/risk_level" element={<PrivateRoute permission='statistic_equipment'><StatisticByRiskLevel /></PrivateRoute>} />
          <Route path="/statistic/equipment_type" element={<PrivateRoute permission='statistic_equipment'><StatisticByEquipmentType /></PrivateRoute>} />
          <Route path="/statistic/year" element={<PrivateRoute permission='statistic_equipment'><StatisticByYear /></PrivateRoute>} />

          {/* Organization Routes */}
          <Route path="/organization/department" element={<PrivateRoute permission='department.read'><Department /></PrivateRoute>} />
          <Route path="/organization/department/create" element={<PrivateRoute permission='department.create'><CreateDepartment /></PrivateRoute>} />
          <Route path="/organization/department/detail/:id" element={<PrivateRoute permission='department.update'><DetailDepartment /></PrivateRoute>} />
          <Route path="/organization/provider" element={<PrivateRoute permission='dashboard.read'><Provider /></PrivateRoute>} />
          <Route path="/organization/provider/create" element={<PrivateRoute permission='dashboard.read'><CreateProvider /></PrivateRoute>} />
          <Route path="/organization/provider/detail/:id" element={<PrivateRoute permission='dashboard.read'><DetailProvider /></PrivateRoute>} />

          {/* User Routes */}
          <Route path="/user/list_user" element={<PrivateRoute permission='user.read'><User /></PrivateRoute>} />
          <Route path="/user/create_user" element={<PrivateRoute permission='user.create'><CreateUser /></PrivateRoute>} />
          <Route path="/user/detail/:id" element={<PrivateRoute permission='user.update'><DetailUser /></PrivateRoute>} />

          {/* Profile Routes */}
          <Route path="/profile" element={<PrivateRoute permission='user.read'><Profile /></PrivateRoute>} />

          {/* Category Routes */}

            {/* Group */}
          <Route path="/category/group" element={<PrivateRoute permission='group_equipment.read'><EquipmentGroup /></PrivateRoute>} />
          <Route path="/category/group/create" element={<PrivateRoute permission='group_equipment.create'><CreateEquipmentGroup /></PrivateRoute>} />
          <Route path="/category/group/detail/:id" element={<PrivateRoute permission='group_equipment.update'><DetailEquipmentGroup /></PrivateRoute>} />

            {/* Type */}
          <Route path="/category/type" element={<PrivateRoute permission='type_equipment.read'><EquipmentType /></PrivateRoute>} />
          <Route path="/category/type/create" element={<PrivateRoute permission='type_equipment.create'><CreateEquipmentType /></PrivateRoute>} />
          <Route path="/category/type/detail/:id" element={<PrivateRoute permission='type_equipment.update'><DetailEquipmentType /></PrivateRoute>} />
          {/* <Route path="/category/type/import_by_excel" element={<PrivateRoute permission='a'><ImportEquipmentTypeByExcel /></PrivateRoute>} /> */}

            {/* Unit */}
          <Route path="/category/unit" element={<PrivateRoute permission='unit_equipment.read'><EquipmentUnit /></PrivateRoute>} />
          <Route path="/category/unit/create" element={<PrivateRoute permission='unit_equipment.create'><CreateEquipmentUnit /></PrivateRoute>} />
          <Route path="/category/unit/detail/:id" element={<PrivateRoute permission='unit_equipment.update'><DetailEquipmentUnit /></PrivateRoute>} />

            {/* Status */}
          <Route path="/category/status" element={<PrivateRoute permission='dashboard.read'><EquipmentStatus /></PrivateRoute>} />
          <Route path="/category/status/create" element={<PrivateRoute permission='dashboard.read'><CreateEquipmentStatus /></PrivateRoute>} />
          <Route path="/category/status/detail/:id" element={<PrivateRoute permission='dashboard.read'><DetailEquipmentStatus /></PrivateRoute>} />

          {/* Setting Routes */}
          <Route path="/setting/role" element={<PrivateRoute permission='dashboard.read'><SetRole /></PrivateRoute>} />
          <Route path="/setting/role/update/:role/:id" element={<PrivateRoute permission='dashboard.read'><UpdatePermission /></PrivateRoute>} />
          <Route path="/setting/notification" element={<PrivateRoute permission='dashboard.read'><Notification /></PrivateRoute>} />
          <Route path="/setting/email-config" element={<PrivateRoute permission='dashboard.read'><EmailConfig /></PrivateRoute>} />

          {/* Auth Routes */}
          <Route path="/signin" element={< Signin />} />
          <Route path="/signup" element={< Signup />} />
          <Route path="/active/:active_token" element={< ActiveAccount />} />
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
  )
}

export default App