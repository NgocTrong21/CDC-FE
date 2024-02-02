import React, { useState, useContext, useEffect } from 'react';
import { Layout, Menu, Row, Avatar, Dropdown, Badge, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  SettingOutlined,
  BellFilled,
  DownOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  SisternodeOutlined,
  ShopOutlined,
  ClusterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import logo from 'assets/logo.png';
import { useDispatch } from 'react-redux';
import { authActions } from 'store/slices/auth.slice';
import { NotificationContext } from 'contexts/notification.context';
import ModalChangePassword from 'components/ModalChangePassword';
import { CURRENT_USER } from 'constants/auth.constant';
import { permissions } from 'constants/permission.constant';
import moment from 'moment';
import { getCurrentUser, handleUrlInNotification } from 'utils/globalFunc.util';
import './index.css';
import userApi from 'api/user.api';

const { Header, Sider, Content, Footer } = Layout;
interface LayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const LayoutSystem = (props: LayoutProps) => {
  const { count, notification } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const [image, setImage] = useState<any>('');
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location.pathname.split('/');
  const [collapsed, setCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState<boolean>(false);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const userPermissions = user?.Role?.Role_Permissions;

  const getUserImage = () => {
    userApi
      .getProfile(user.id)
      .then((res: any) => {
        setImage(res.data.data.user.image);
      })
      .catch();
  };

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    permission?: Number | Boolean,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): any {
    let isHasPermission: boolean = userPermissions.some(
      (item: any) => item.permission_id === permission
    );
    if (isHasPermission) {
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
    getItem(
      'Quản lý thiết bị',
      '/equipment',
      permissions.EQUIPMENT_READ,
      <ClusterOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách thiết bị', '/list_eq', permissions.EQUIPMENT_READ),
        getItem(
          'Nhập thiết bị đơn lẻ',
          '/import_one_eq',
          permissions.EQUIPMENT_CREATE
        ),
        getItem(
          'Nhập thiết bị bằng Excel',
          '/import_excel_eq',
          permissions.EQUIPMENT_CREATE
        ),
        getItem('Sửa chữa', '/repair', permissions.REPAIR_EQUIPMENT_READ),
        getItem(
          'Điều chuyển thiết bị',
          '/transfer',
          permissions.TRANFER_EQUIPMENT_READ
        ),
        getItem(
          'Thanh lý thiết bị',
          '/liquidation',
          permissions.LIQUIDATION_EQUIPMENT_READ
        ),
      ]
    ),

    getItem(
      'Quản lý vật tư',
      '/supplies',
      permissions.CONSUMABLE_SUPPLY_READ,
      <SisternodeOutlined style={{ fontSize: '20px' }} />,
      [
        getItem(
          'Danh sách vật tư',
          '/list_sp',
          permissions.CONSUMABLE_SUPPLY_READ
        ),
        getItem(
          'Nhập vật tư theo Excel',
          '/import_excel_sp',
          permissions.CONSUMABLE_SUPPLY_CREATE
        ),
        getItem(
          'Nhập vật tư đơn lẻ',
          '/create_sp',
          permissions.CONSUMABLE_SUPPLY_CREATE
        ),
        // getItem(
        //   'Danh sách vật tư theo khoa',
        //   '/list_sp_depart',
        //   permissions.CONSUMABLE_SUPPLY_READ
        // ),
      ]
    ),
    getItem(
      'Quản lý kho',
      '/warehouses',
      permissions.WAREHOUSES_MANAGEMENT_READ,
      <ShopOutlined style={{ fontSize: '20px' }} />,
      [
        getItem(
          'Danh sách kho',
          '/list_warehouses',
          permissions.WAREHOUSES_MANAGEMENT_READ
        ),
        getItem(
          'Nhập thông tin kho',
          '/import_warehouse',
          permissions.WAREHOUSES_MANAGEMENT_CREATE
        ),
      ]
    ),
    getItem(
      'Quản lý phiếu',
      '/order',
      permissions.INBOUND_ORDERS_READ,
      <FileTextOutlined style={{ fontSize: '20px' }} />,
      [
        getItem(
          'Quản lý phiếu nhập',
          '/inbound_order',
          permissions.INBOUND_ORDERS_READ
        ),
        getItem(
          'Quản lý phiếu xuất bệnh viện',
          '/outbound_order',
          permissions.OUTBOUND_ORDERS_READ
        ),
        getItem(
          'Quản lý phiếu xuất nội bộ',
          '/outbound_order_depart',
          permissions.OUTBOUND_ORDERS_READ
        ),
      ]
    ),
    getItem(
      'Báo cáo tồn kho vật tư',
      '/report_supplies',
      permissions.CONSUMABLE_SUPPLY_READ,
      <BarChartOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Tồn kho', '/all', permissions.CONSUMABLE_SUPPLY_READ),
        getItem(
          'Tồn vật tư theo kho',
          '/report_supplies_by_warehouse',
          permissions.CONSUMABLE_SUPPLY_READ
        ),
      ]
    ),
    getItem(
      'Quản lý tổ chức',
      '/organization',
      permissions.DEPARTMENT_READ,
      <UsergroupAddOutlined style={{ fontSize: '20px' }} />,
      [
        getItem(
          'Khoa - Phòng',
          [2, 6, 4].includes(getCurrentUser().role_id)
            ? `/department/detail/${getCurrentUser().department_id}`
            : `/department`,
          permissions.DEPARTMENT_READ
        ),
      ]
    ),
    ![2, 6, 4].includes(getCurrentUser().role_id) &&
      getItem(
        'Quản lý thành viên',
        '/user',
        permissions.USER_READ,
        <UserOutlined style={{ fontSize: '20px' }} />,
        [
          getItem('Danh sách thành viên', '/list_user', permissions.USER_READ),
          getItem(
            'Thêm mới thành viên',
            '/create_user',
            permissions.USER_CREATE
          ),
        ]
      ),
    getItem(
      'Quản lý danh mục',
      '/category',
      permissions.UNIT_EQUIPMENT_UPDATE,
      <UnorderedListOutlined style={{ fontSize: '20px' }} />,
      [getItem('Đơn vị tính', '/unit', permissions.UNIT_EQUIPMENT_READ)]
    ),
    getItem(
      'Cài đặt',
      '/setting',
      permissions.SETTING_ROLE,
      <SettingOutlined style={{ fontSize: '20px' }} />,
      [
        // getItem('Cấu hình hệ thống', '/email-config', permissions.SETTING_INFO),
        getItem('Phân quyền', '/role', permissions.SETTING_ROLE),
        // getItem('Thông báo', '/notification', permissions.SETTING_INFO),
      ]
    ),
  ];
  const menu = (
    <>
      <div
        className="bg-white rounded-lg shadow-lg relative pt-2 pl-2 pb-2 "
        // style={{ overflowY: 'scroll' }}
      >
        <div className="flex items-center justify-between rounded-lg">
          <h1 className="font-bold text-2xl pl-3 pt-2 pb-1">Thông báo</h1>
          <Link
            to="/setting/notification"
            className=" text-base flex pr-4 pt-2 pb-1"
          >
            Xem tất cả
          </Link>
        </div>
        <Menu
          className="shadow-none"
          items={notification.map((item: any) => {
            return {
              key: item.id,
              label: (
                <div
                  className={`${
                    item.is_seen === 0 ? '' : 'text-gray-400'
                  } text-base`}
                >
                  <Row>
                    {/* <Link to={`${handleUrlInNotification(item)}`}>
                      {item.content}
                    </Link> */}
                    <div
                      className="cursor-pointer "
                      onClick={() => handleUrlInNotification(item)}
                    >
                      <div className=" text-base ">{item.content}</div>
                    </div>
                  </Row>
                  <div
                    className={`${item.is_seen === 0 ? 'text-sky-500' : ''} `}
                  >
                    {moment(item.createdAt).format('hh:mm:ss, DD-MM-YYYY')}
                  </div>
                  {/* <Divider style={{ margin: 0 }} /> */}
                </div>
              ),
            };
          })}
          style={{
            width: 350,
            maxHeight: 500,
            overflowY: 'scroll',
          }}
        />
        {/* <div
          className=" p-4 cursor-pointer  trigger text-center"
          onClick={() => navigate('/setting/notification')}
        >
          <div className="text-center text-base ">Xem tất cả thông báo</div>
        </div> */}
      </div>
    </>
  );

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`${e.keyPath[1]}${e.keyPath[0]}`);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  useEffect(() => {
    getUserImage();
  }, [user.id]);

  return (
    <Layout>
      <Layout className="min-h-screen">
        <Sider
          trigger={null}
          collapsed={collapsed}
          width="250px"
          className="bg-[#001529]"
          collapsedWidth={72}
        >
          <div className="flex items-center justify-center h-20 gap-5 rounded-lg p-2">
            {!collapsed ? (
              <div className="w-full flex items-center gap-5 p-2 rounded-lg bg-[#ffffff29]">
                <img src={logo} alt="logo" className="h-10 " />
                <h2 className="font-medium text-base text-white">
                  CDC HP DEMO
                </h2>
              </div>
            ) : (
              <img src={logo} alt="logo" className="h-10 " />
            )}
          </div>
          <Menu
            mode="inline"
            onClick={onClick}
            defaultSelectedKeys={[`/${pathName[2]}`]}
            defaultOpenKeys={[`/${pathName[1]}`]}
            items={items}
            triggerSubMenuAction="click"
            className="font-medium"
            theme="dark"
          />
        </Sider>
        <Layout>
          <Header className="bg-[#f0f2f5]  px-4  flex flex-row items-center justify-between">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger menu-icon p-[10px]',
                onClick: () => {
                  setCollapsed(!collapsed);
                },
              }
            )}
            <div
              className="flex flex-row items-center cursor-pointer  "
              onClick={() => navigate('/equipment/list_eq')}
            >
              <Space>
                <img src={logo} alt="logo" className="logo" />
                <div className="font-medium text-base ">
                  <h2>Quản lý thiết bị và vật tư y tế CDC HP DEMO</h2>
                </div>
              </Space>
            </div>
            <Space className="h-[40px] flex flex-row items-center">
              {/* notifications */}
              {/* <Dropdown
            overlay={menu}
            placement="bottomRight"
            arrow
            trigger={['click']}
            className="flex flex-column h-[40px]"
          >
            <Badge count={count} className="trigger p-3" offset={[-10, 10]}>
              <BellFilled
                style={{ fontSize: '20px' }}
                className="trigger text-[20px] "
              />
            </Badge>
          </Dropdown> */}

              {/* Avatar */}
              <Dropdown
                trigger={['click']}
                arrow
                className="trigger items-center flex flex-row h-[40px] "
                overlay={
                  <Menu className="rounded-lg">
                    <Menu.Item key="profile">
                      <Link to="/profile">Tài khoản</Link>
                    </Menu.Item>
                    <Menu.Item key="change_password">
                      <Row onClick={() => setShowChangePasswordModal(true)}>
                        Thay đổi mật khẩu
                      </Row>
                    </Menu.Item>
                    <Menu.Item key="signout" onClick={handleLogout}>
                      Đăng xuất
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Space>
                  <Avatar
                    src={image}
                    icon={<UserOutlined />}
                    className="w-[40px] h-[40px] flex flex-row place-content-center"
                  />

                  <div className="h-[40px] flex flex-row items-center">
                    {user?.name || user?.email}
                  </div>
                  <DownOutlined className=" flex flex-row " />
                </Space>
              </Dropdown>
            </Space>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
            }}
          >
            <div
              className="bg-white rounded-lg"
              style={{
                // maxWidth: '1600px',
                // margin: '0 auto',
                padding: 20,
              }}
            >
              {props.children}
            </div>
          </Content>
          {/* <Footer>
            <div className="text-base font-medium">
              Copyright © 2023 iBME HUST
            </div>
          </Footer> */}
        </Layout>
      </Layout>

      <ModalChangePassword
        showChangePasswordModal={showChangePasswordModal}
        setShowChangePasswordModal={() => setShowChangePasswordModal(false)}
      />
    </Layout>
  );
};

export default LayoutSystem;
