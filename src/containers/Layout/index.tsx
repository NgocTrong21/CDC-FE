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
  FileDoneOutlined,
  SisternodeOutlined,
  ClusterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
import { handleUrlInNotification } from 'utils/globalFunc.util';
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

  console.log(user);

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
        // getItem('Thông báo kiểm định', '7'),
        // getItem(
        //   'Bảo dưỡng định kì',
        //   '/maintenance',
        //   permissions.MAINTAINANCE_EQUIPMENT_READ
        // ),
        // getItem(
        //   'Kiểm định',
        //   '/inspection',
        //   permissions.ACCREDITATION_EQUIPMENT_READ
        // ),
        // getItem('Kiểm xạ', '10', permissions.RADIATION_EQUIPMENT_READ),
        // getItem(
        //   'Ngoại kiểm',
        //   '11',
        //   permissions.EXTERNAL_INSPECTION_EQUIPMENT_READ
        // ),
        // getItem('Kiểm định môi trường phòng', '12'),
        // getItem('Gia hạn giấy phép', '13'),
        // getItem('Bảo hành', '14', permissions.INSURANCE_EQUIPMENT_READ),
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
      permissions.EQUIPMENT_READ,
      <SisternodeOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách vật tư', '/list_sp', permissions.EQUIPMENT_READ),
        getItem(
          'Nhập vật tư theo Excel',
          '/import_excel_sp',
          permissions.IMPORT_SUPPLIES
        ),
        getItem(
          'Nhập vật tư đơn lẻ',
          '/create_sp',
          permissions.IMPORT_SUPPLIES
        ),
      ]
    ),

    getItem(
      'Quản lý tổ chức',
      '/organization',
      permissions.DEPARTMENT_READ,
      <UsergroupAddOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Khoa - Phòng', '/department', permissions.DEPARTMENT_READ),
        getItem(
          'Nhà cung cấp dịch vụ',
          '/provider',
          permissions.DEPARTMENT_READ
        ),
        getItem('Dịch vụ', '/service', permissions.DEPARTMENT_READ),
      ]
    ),
    getItem(
      'Quản lý thành viên',
      '/user',
      permissions.DEPARTMENT_READ,
      <UserOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách thành viên', '/list_user', permissions.USER_READ),
        getItem('Thêm mới thành viên', '/create_user', permissions.USER_CREATE),
      ]
    ),
    getItem(
      'Quản lý danh mục',
      '/category',
      permissions.GROUP_EQUIPMENT_READ,
      <UnorderedListOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Nhóm thiết bị', '/group', permissions.GROUP_EQUIPMENT_READ),
        getItem('Loại thiết bị', '/type', permissions.TYPE_EQUIPMENT_READ),
        getItem('Đơn vị tính', '/unit', permissions.UNIT_EQUIPMENT_READ),
        getItem('Trạng thái', '/status', true),
        getItem('Chu kỳ', '/cycle'),
      ]
    ),
    getItem(
      'Thống kê thiết bị',
      '/statistic',
      permissions.STATISTIC_EQUIPMENT,
      <BarChartOutlined style={{ fontSize: '20px' }} />,
      [
        getItem(
          'Theo khoa phòng',
          '/department',
          permissions.STATISTIC_EQUIPMENT
        ),
        getItem(
          'Theo trạng thái sử dụng',
          '/status',
          permissions.STATISTIC_EQUIPMENT
        ),
        getItem(
          'Theo mức độ rủi ro',
          '/risk_level',
          permissions.STATISTIC_EQUIPMENT
        ),
        getItem(
          'Theo loại thiết bị',
          '/equipment_type',
          permissions.STATISTIC_EQUIPMENT
        ),
        getItem('Theo năm', '/year', permissions.STATISTIC_EQUIPMENT),
        getItem('Theo dự án', '/project', permissions.STATISTIC_EQUIPMENT),
        getItem(
          'Theo thời gian kiểm định',
          '/accreditation',
          permissions.STATISTIC_EQUIPMENT
        ),
        getItem(
          'Theo thời gian hết hạn bảo hành',
          '/warranty_expires',
          permissions.STATISTIC_EQUIPMENT
        ),
        getItem(
          'Thống kê vật tư',
          '/supplies',
          permissions.STATISTIC_EQUIPMENT
        ),
      ]
    ),
    getItem(
      'Kiểm kê',
      '/inventories',
      permissions.INVENTORY_EQUIPMENT_READ,
      <FileDoneOutlined style={{ fontSize: '20px' }} />,
      [
        getItem(
          'Danh sách kiểm kê thiết bị',
          '/equipment',
          permissions.INVENTORY_EQUIPMENT_READ
        ),
        getItem(
          'Danh sách kiểm kê vật tư',
          '/supplies',
          permissions.INVENTORY_EQUIPMENT_READ
        ),
      ]
    ),
    getItem(
      'Cài đặt',
      '/setting',
      permissions.SETTING_INFO,
      <SettingOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Cấu hình hệ thống', '/email-config', permissions.SETTING_INFO),
        getItem('Phân quyền', '/role', permissions.SETTING_ROLE),
        getItem('Thông báo', '/notification', permissions.SETTING_INFO),
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

  console.log(image);
  return (
    <Layout>
      <Header className="bg-white  px-4  flex flex-row items-center justify-between ">
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
          onClick={() => navigate('/')}
        >
          <Space>
            <img src={logo} alt="logo" className="logo" />
            <div className="font-medium text-base ">
              <h2>Quản lý thiết bị và vật tư y tế CPC HP DEMO</h2>
            </div>
          </Space>
        </div>

        <Space className="h-[40px] flex flex-row items-center">
          {/* notifications */}
          <Dropdown
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
          </Dropdown>

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
      <Layout className="min-h-screen">
        <Sider
          trigger={null}
          collapsed={collapsed}
          width="250px"
          className="bg-white  p  "
          collapsedWidth={72}
        >
          <Menu
            mode="inline"
            onClick={onClick}
            defaultSelectedKeys={[`/${pathName[2]}`]}
            defaultOpenKeys={[`/${pathName[1]}`]}
            items={items}
            triggerSubMenuAction="click"
            className="font-medium "
          />
        </Sider>

        <Layout>
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
          <Footer>
            <div className="text-base font-medium">
              Copyright © 2023 iBME HUST
            </div>
          </Footer>
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
