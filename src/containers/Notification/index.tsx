import { DeleteFilled, EyeFilled, ToolFilled } from '@ant-design/icons';
import {
  Divider,
  Menu,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from 'antd';
import notificationApi from 'api/notification.api';
import useQuery from 'hooks/useQuery';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { handleUrlInNotification } from 'utils/globalFunc.util';

const limit: number = 10;
const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Notification = () => {
  const location = useLocation();
  const pathName: any = location?.pathname;
  const navigate = useNavigate();
  const query = useQuery();
  const currentPage = query?.page;
  const [page, setPage] = useState<number>(currentPage);
  const [total, setTotal] = useState<number>(1);
  const [notification, setNotification] = useState<any>([]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    navigate(`${pathName}?page=${page}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thông báo`,
    onChange: onPaginationChange,
  };

  const handleDelete = (item: any) => {};

  const columns: any = [
    {
      title: 'Thời gian',
      key: 'createdAt',
      render: (item: any) => (
        <div className={!item?.is_seen ? 'text-red-600' : ''}>
          {moment(item?.createdAt).format('hh:mm:ss a DD-MM-YYYY')}
        </div>
      ),
    },
    {
      title: 'Nội dung',
      key: 'content',
      render: (item: any) => (
        <div className={!item?.is_seen ? 'text-red-600' : ''}>
          {item.content}
        </div>
      ),
    },
    {
      title: 'Người gửi',
      key: 'user_id',
      render: (item: any) => (
        <div className={!item?.is_seen ? 'text-red-600' : ''}>
          {item?.User?.name}
        </div>
      ),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (item: any) => (
        <Menu className="flex flex-row">
          <Menu.Item key="detail">
            <Tooltip title="Chi tiết thông báo">
              <Link to={`${handleUrlInNotification(item)}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="seen">
            <Tooltip title="Đánh dấu là đã đọc">
              <ToolFilled />
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="delete">
            <Tooltip title="Xóa thông báo">
              <Popconfirm
                title="Bạn muốn xóa thông báo này?"
                onConfirm={() => handleDelete(item.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteFilled />
              </Popconfirm>
            </Tooltip>
          </Menu.Item>
        </Menu>
      ),
    },
  ];

  const getAllNotifications = (page: number) => {
    notificationApi
      .list(page)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setNotification(data.notifications.rows);
          setTotal(data.notifications.count);
        }
      })
      .catch();
  };

  useEffect(() => {
    getAllNotifications(page);
  }, [page]);

  return (
    <div>
      <div className="title text-center">THÔNG BÁO</div>
      <Divider />
      <Table
        columns={columns}
        dataSource={notification}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
      />
    </div>
  );
};

export default Notification;
