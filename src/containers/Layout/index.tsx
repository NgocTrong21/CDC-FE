import React, { useState, useContext } from 'react';
import { Layout, Menu, Row, Avatar, Dropdown, Divider, Badge } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  BellFilled,
  DownOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import logo from "assets/logo.png";
import { useDispatch } from 'react-redux';
import { authActions } from 'store/slices/auth.slice';
import { NotificationContext } from 'contexts/notification.context';
import ModalChangePassword from 'components/ModalChangePassword';
import { CURRENT_USER } from 'constants/auth.constant';
import { permissions } from 'constants/permission.constant';
const { Header, Sider, Content, Footer } = Layout;
interface LayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];



const LayoutSystem = (props: LayoutProps) => {

  const { count, notification } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location.pathname.split("/");
  const [collapsed, setCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const userPermissions = user?.Role?.Role_Permissions;

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    permission?: Number | Boolean,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): any {
    let isHasPermission: boolean = userPermissions.some((item: any) => item.permission_id === permission);
    if(isHasPermission) {
      return {
        key,
        icon,
        children,
        label,
        type,
      } as MenuItem;
    } else {
      return;
    }
    
  }
  
  const items: MenuProps['items'] = [
    getItem('Quản lý thiết bị', '/equipment', permissions.EQUIPMENT_READ, <MailOutlined />, [
      getItem('Danh sách thiết bị', '/list_eq', permissions.EQUIPMENT_READ),
      getItem('Nhập thiết bị đơn lẻ', '/import_one_eq', permissions.EQUIPMENT_CREATE),
      getItem('Nhập thiết bị bằng Excel', '/import_excel_eq', permissions.EQUIPMENT_CREATE),
      getItem('Sửa chữa', '/repair', permissions.REPAIR_EQUIPMENT_READ),
      // getItem('Thông báo kiểm định', '7'),
      // getItem('Bảo dưỡng định kì', '/maintenance', permissions.MAINTAINANCE_EQUIPMENT_READ),
      // getItem('Kiểm định', '/accreditation', permissions.ACCREDITATION_EQUIPMENT_READ),
      // getItem('Kiểm xạ', '10', permissions.RADIATION_EQUIPMENT_READ),
      // getItem('Ngoại kiểm', '11', permissions.EXTERNAL_INSPECTION_EQUIPMENT_READ),
      // getItem('Kiểm định môi trường phòng', '12'),
      // getItem('Gia hạn giấy phép', '13'),
      // getItem('Bảo hành', '14', permissions.INSURANCE_EQUIPMENT_READ),
      getItem('Điều chuyển thiết bị', '/transfer', permissions.TRANFER_EQUIPMENT_READ),
      getItem('Thanh lý thiết bị', '/liquidation', permissions.LIQUIDATION_EQUIPMENT_READ),
    ]),
  
    getItem('Quản lý vật tư', '/supplies', permissions.EQUIPMENT_READ, <AppstoreOutlined />, [
      getItem('Danh sách vật tư', '/list_sp', permissions.EQUIPMENT_READ),
      getItem('Nhập vật tư theo Excel', '/import_excel_sp', permissions.EQUIPMENT_READ),
      getItem('Nhập vật tư đơn lẻ', '/create_sp', permissions.EQUIPMENT_READ),
    ]),
  
    getItem('Quản lý tổ chức', '/organization', permissions.DEPARTMENT_READ, <SettingOutlined />, [
      getItem('Khoa - Phòng', '/department', permissions.DEPARTMENT_READ),
      getItem('Nhà cung cấp dịch vụ', '/provider', permissions.DEPARTMENT_READ),
      getItem('Dịch vụ', '/service', permissions.DEPARTMENT_READ),
    ]),
    getItem('Quản lý thành viên', '/user', permissions.USER_READ, <SettingOutlined />, [
      getItem('Danh sách thành viên', '/list_user', permissions.USER_READ),
      getItem('Thêm mới thành viên', '/create_user', permissions.USER_CREATE),
    ]),
    getItem('Quản lý danh mục', '/category', permissions.GROUP_EQUIPMENT_READ, <SettingOutlined />, [
      getItem('Nhóm thiết bị', '/group', permissions.GROUP_EQUIPMENT_READ),
      getItem('Loại thiết bị', '/type', permissions.TYPE_EQUIPMENT_READ),
      getItem('Đơn vị tính', '/unit', permissions.UNIT_EQUIPMENT_READ),
      getItem('Trạng thái', '/status', true),
      getItem('Chu kỳ', '/cycle'),
    ]),
    getItem('Thống kê thiết bị', '/statistic', permissions.STATISTIC_EQUIPMENT, <SettingOutlined />, [
      getItem('Theo khoa phòng', '/department', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo trạng thái sử dụng', '/status', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo mức độ rủi ro', '/risk_level', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo loại thiết bị', '/equipment_type', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo năm', '/year', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo dự án', '/project', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo thời gian kiểm định', '/accreditation', permissions.STATISTIC_EQUIPMENT),
      getItem('Theo thời gian hết hạn bảo hành', '/warranty_expires', permissions.STATISTIC_EQUIPMENT),
      getItem('Thống kê vật tư', '/supplies', permissions.STATISTIC_EQUIPMENT),
    ]),
    // getItem('Kiểm kê', '/inventories', permissions.INVENTORY_EQUIPMENT_READ, <SettingOutlined />, [
    //   getItem('Danh sách kiểm kê thiết bị', '/equipment', permissions.INVENTORY_EQUIPMENT_READ),
    //   getItem('Danh sách kiểm kê vật tư', '/supplies', permissions.INVENTORY_EQUIPMENT_READ),
    // ]),
    getItem('Cài đặt', '/setting', permissions.SETTING_INFO, <SettingOutlined />, [
      getItem('Cấu hình hệ thống', '/email-config', permissions.SETTING_INFO),
      getItem('Phân quyền', '/role', permissions.SETTING_ROLE),
      getItem('Thông báo', '/notification', true),
    ]),
  ];

  const menu = (
    <Menu
      items={notification.map((item: any) => {
        return {
          key: item.id,
          label: (
            <>
              <Row
              >{`${item?.Equipment?.name} 
                đã được ${item?.Action?.name} 
                ${item?.Department?.name ? 'qua' : ''} 
                ${item?.Department?.name}`}
              </Row>
              <Divider />
            </>
          )
        }
      })}
    />
  );

  const onClick: MenuProps['onClick'] = e => {
    navigate(`${e.keyPath[1]}${e.keyPath[0]}`);
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggle}
        width="250px"
        className='bg-white min-h-screen'
        style={{
          // overflowY: 'scroll',
          overflowX: 'hidden',
          height: "100vh",
          position: "fixed"
        }}
        trigger={null}
      >
        <div className="flex flex-row items-center p-4 gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%"
            }}
          />
          {!collapsed && <div className="font-medium text-base">Quản lý thiết bị-vật tư</div>}
        </div>
        <Divider className="m-1" />
        <Menu
          onClick={onClick}
          style={{ width: 250}}
          defaultSelectedKeys={[`/${pathName[2]}`]}
          defaultOpenKeys={[`/${pathName[1]}`]}
          items={items}
          mode="inline"
        />
      </Sider>
      <Layout className="min-h-screen" style={collapsed ? {
          marginLeft: "4.6rem"
        } : {
          marginLeft: "250px"
        }}>
        <Header className="bg-white p-0 h-[66px]">
          <Row className="flex justify-between items-center gap-4 px-6">
            <BarsOutlined onClick={toggle} />
            <div className="flex flex-row items-center gap-6">
              {/* <SettingFilled /> */}
              <Dropdown 
                overlay={menu} 
                placement="bottomRight" 
                arrow 
                overlayClassName="rounded-3xl"
                trigger={['click']}
              >
                <Badge count={count}>
                  <BellFilled className="h-5 w-5" />
                </Badge>
              </Dropdown>
              <Avatar icon={<UserOutlined />} />
              <div>{user?.name || user?.email}</div>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="profile">
                      <Link to="/profile">Tài khoản</Link>
                    </Menu.Item>
                    <Menu.Item key="change_password">
                      <Row onClick={() => setShowChangePasswordModal(true)}>Thay đổi mật khẩu</Row>
                    </Menu.Item>
                    <Menu.Item key="signout" onClick={handleLogout}>
                      Đăng xuất
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <DownOutlined />
              </Dropdown>
            </div>
          </Row>
        </Header>
        <Divider className="m-0" />
        <Content
          style={{
            margin: '24px 16px',
          }}
        >
          <div
            className="site-layout-background"
            style={{
              maxWidth: '1600px',
              margin: '0 auto',
              padding: 20,
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer><div className='text-base font-medium'>Copyright © 2022 iBME HUST</div></Footer>
      </Layout>
      <ModalChangePassword 
        showChangePasswordModal={showChangePasswordModal}
        setShowChangePasswordModal={() => setShowChangePasswordModal(false)}
      />
    </Layout>
  )
}

export default LayoutSystem