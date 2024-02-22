import { useEffect, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusCircleFilled,
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
  Popconfirm,
  Select,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkPermission } from 'utils/globalFunc.util';
import { permissions } from 'constants/permission.constant';
import type { PaginationProps } from 'antd';
import inboundOrderApi from 'api/inbound_order';
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

const InboundOrderList = () => {
  const [inboundOrders, setInboundOrders] = useState<any>();
  const navigate = useNavigate();
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
  const [status, setStatus] = useState<any>();

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    setLimit(pageSize);
  };
  const getInboundOrderList = () => {
    setLoading(true);
    inboundOrderApi
      .search({
        page,
        limit,
        name: nameSearch,
        status_id: status,
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setInboundOrders(data.inbound_orders.rows);
          setTotal(data.inbound_orders.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getInboundOrderList();
  }, [limit, page, nameSearch, status]);
  const columns: any = [
    {
      title: 'Số phiếu',
      key: 'code',
      dataIndex: 'code',
      show: true,
      widthExcel: 30,
      width: 80,
    },
    {
      title: 'Trạng thái',
      show: true,
      widthExcel: 30,
      render: (_item: any, record: any) => record.Order_Note_Status.name,
      width: 100,
    },
    {
      title: 'Ngày tạo',
      show: true,
      widthExcel: 30,
      width: 100,
      render: (_item: any, record: any) =>
        moment(new Date(record.createdAt)).format('DD/MM/YYYY'),
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      dataIndex: 'provider',
      widthExcel: 30,
      width: 100,
    },
    {
      title: 'Kho hàng',
      show: true,
      widthExcel: 30,
      width: 100,
      render: (_item: any, record: any) => record.Warehouse.name,
    },
    {
      title: 'Người giao hàng',
      dataIndex: 'deliver',
      key: 'deliver',
      show: true,
      widthExcel: 30,
      width: 100,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      width: 100,
      render: (item: any) => (
        <Menu className="flex flex-row items-center">
          {item?.status_id === 1 && (
            <Menu.Item
              key="update_equipment"
              className={`${
                checkPermission(permissions.INBOUND_ORDERS_UPDATE)
                  ? ''
                  : 'hidden'
              }`}
            >
              <Tooltip title="Cập nhật phiếu">
                <Link to={`/order/inbound_order/update/${item.id}`}>
                  <EditFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
          <Menu.Item
            className={`${
              checkPermission(permissions.INBOUND_ORDERS_READ) ? '' : 'hidden'
            }`}
          >
            <Tooltip title="Chi tiết phiếu">
              <Link to={`/order/inbound_order/detail/${item.id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          {(item?.status_id === 1 || item?.status_id === 3) && (
            <Menu.Item
              key="delete"
              className={`${
                checkPermission(permissions.INBOUND_ORDERS_DELETE)
                  ? ''
                  : 'hidden'
              }`}
            >
              <Tooltip title="Xóa phiếu">
                <Popconfirm
                  title="Bạn muốn xóa phiếu này?"
                  onConfirm={() => {
                    handleDelete(item.id);
                  }}
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

  const columnTable = columns;

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

  const handleDelete = (id: number) => {
    inboundOrderApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        getInboundOrderList();
        if (success) {
          toast.success('Xóa thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
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
        <div className="title">DANH SÁCH PHIẾU NHẬP</div>
      </div>
      <Divider />
      <div className="flex items-center gap-10">
        {/* <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div> */}
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
            checkPermission(permissions.INBOUND_ORDERS_CREATE) ? '' : 'hidden'
          }`}
          onClick={() => {
            navigate('/order/inbound_order/import');
          }}
        >
          <PlusCircleFilled />
          <div className="font-medium text-md text-[#5B69E6]">
            Tạo phiếu nhập mới
          </div>
        </Button>
      </div>
      {/* {isShowCustomTable && (
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
      )} */}
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={inboundOrders}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
        scroll={{ x: 1000, y: 580 }}
      />
    </div>
  );
};

export default InboundOrderList;
