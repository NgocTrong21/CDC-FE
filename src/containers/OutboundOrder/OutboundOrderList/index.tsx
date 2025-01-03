import { useEffect, useState } from 'react';
import {
  EditFilled,
  EyeFilled,
  SelectOutlined,
  PlusCircleFilled,
  DeleteFilled,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  Table,
  Menu,
  Row,
  Pagination,
  Tooltip,
  Checkbox,
  Popconfirm,
  Select,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkPermission, onChangeCheckbox } from 'utils/globalFunc.util';
import { permissions } from 'constants/permission.constant';
import type { PaginationProps } from 'antd';
import outboundOrderApi from 'api/outbound_order';
import moment from 'moment';
import { inbound_outbound_status } from 'constants/dataFake.constant';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const OutboundOrderList = () => {
  const navigate = useNavigate();
  const [outboundOrders, setOutboundOrders] = useState<any>();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [status, setStatus] = useState<any>();
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    pageSize
  ) => {
    setLimit(pageSize);
  };
  const handleDelete = (id: number) => {
    outboundOrderApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        getOutboundOrderList();
        if (success) {
          toast.success('Xóa thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
  };
  const columns: any = [
    {
      title: 'Số phiếu',
      key: 'code',
      dataIndex: 'code',
      show: true,
      widthExcel: 30,
      with: 100,
    },
    {
      title: 'Trạng thái',
      show: true,
      widthExcel: 30,
      with: 100,
      render: (_item: any, record: any) => record.Order_Note_Status.name,
    },
    {
      title: 'Ngày tạo',
      show: true,
      widthExcel: 30,
      with: 100,
      render: (_item: any, record: any) =>
        moment(new Date(record.createdAt)).format('DD/MM/YYYY'),
    },
    {
      title: 'Người nhận',
      key: 'receiver',
      show: true,
      dataIndex: 'receiver',
      widthExcel: 30,
      with: 100,
    },
    {
      title: 'Kho hàng',
      show: true,
      widthExcel: 30,
      with: 100,
      render: (_item: any, record: any) => record.Warehouse.name,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      show: true,
      widthExcel: 30,
      with: 100,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      with: 100,
      show: true,
      render: (item: any) => (
        <Menu className="flex flex-row items-center">
          {item?.status_id === 1 && (
            <Menu.Item
              key="update_equipment"
              className={`${
                checkPermission(permissions.OUTBOUND_ORDERS_UPDATE)
                  ? ''
                  : 'hidden'
              }`}
            >
              <Tooltip title="Cập nhật phiếu">
                <Link to={`/order/outbound_order/update/${item.id}`}>
                  <EditFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
          <Menu.Item
            className={`${
              checkPermission(permissions.OUTBOUND_ORDERS_READ) ? '' : 'hidden'
            }`}
          >
            <Tooltip title="Chi tiết phiếu">
              <Link to={`/order/outbound_order/detail/${item.id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          {(item?.status_id === 1 || item?.status_id === 3) && (
            <Menu.Item
              key="delete"
              className={`${
                checkPermission(permissions.OUTBOUND_ORDERS_DELETE)
                  ? ''
                  : 'hidden'
              }`}
            >
              <Tooltip title="Xóa phiếu">
                <Popconfirm
                  title="Bạn muốn xóa phiếu này?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <DeleteFilled />
                </Popconfirm>
              </Tooltip>
            </Menu.Item>
          )}
        </Menu>
      ),
    },
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);
  const getOutboundOrderList = () => {
    setLoading(true);
    outboundOrderApi
      .search({
        page,
        limit,
        name: nameSearch,
        type: '0',
        status_id: status,
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setOutboundOrders(data.outbound_orders.rows);
          setTotal(data.outbound_orders.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getOutboundOrderList();
  }, [limit, page, nameSearch, status]);

  const onPaginationChange = (page: number) => {
    setPage(page);
    searchQuery.page = page;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} phiếu`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const onChangeSearch = (e: any) => {
    setName(e.target.value);
    if (e.target.value !== '') {
    } else {
      setPage(1);
    }
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH PHIẾU XUẤT BỆNH VIỆN</div>
      </div>
      <Divider />
      <div className="flex gap-10 items-center">
        <Select
          showSearch
          placeholder="Trạng thái"
          optionFilterProp="children"
          onChange={(value: any) => {
            setStatus(value);
          }}
          allowClear
          filterOption={(input, option) =>
            (option!.label as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          className="select-custom w-56"
          options={inbound_outbound_status}
        />
        <Input
          placeholder="Tìm kiếm phiếu (nhập số phiếu)"
          allowClear
          value={name}
          className="rounded-lg h-9 border-[#A3ABEB] border-2"
          onChange={(e) => onChangeSearch(e)}
        />
        <Button
          className={`button_excel ${
            checkPermission(permissions.OUTBOUND_ORDERS_CREATE) ? '' : 'hidden'
          }`}
          onClick={() => {
            navigate('/order/outbound_order/import');
          }}
        >
          <PlusCircleFilled />
          <div className="font-medium text-md text-[#5B69E6]">
            Tạo phiếu xuất mới
          </div>
        </Button>
      </div>
      {isShowCustomTable && (
        <div className="flex flex-row gap-4">
          {columnTable.length > 0 &&
            columnTable.map((item: any) => (
              <div>
                <Checkbox
                  defaultChecked={item?.show}
                  onChange={(e: any) =>
                    onChangeCheckbox(item, e, columnTable, setColumnTable)
                  }
                />
                <div>{item?.title}</div>
              </div>
            ))}
        </div>
      )}

      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={outboundOrders}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
        scroll={{ x: 1100, y: 580 }}
      />
    </div>
  );
};

export default OutboundOrderList;
