import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  FileExcelFilled,
  ImportOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from 'antd';
import { useState, useEffect } from 'react';
import image from 'assets/image.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import useDebounce from 'hooks/useDebounce';
import supplyApi from 'api/suplly.api';
import { toast } from 'react-toastify';
import { checkPermission, onChangeCheckbox } from 'utils/globalFunc.util';

import type { PaginationProps } from 'antd';
import { permissions } from 'constants/permission.constant';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Suplly = () => {
  const navigate = useNavigate();
  const [supllies, setSupplies] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      show: false,
      render(item: any) {
        return (
          <img src={item?.image || image} alt="logo" className="w-32 h-32" />
        );
      },
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'code',
      key: 'code',
      show: true,
    },
    {
      title: 'Số lô',
      dataIndex: 'lot_number',
      key: 'lot_number',
      show: true,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
      show: true,
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      render: (item: any) => <div>{item?.Equipment_Unit?.name}</div>,
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      dataIndex: 'unit_price',
      render: (item: any) => <p>{formatCurrencyVN(item)}</p>,
      show: true,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      dataIndex: 'provider',
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      show: true,
      dataIndex: 'manufacturing_country',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className="flex flex-row items-center">
          {checkPermission(permissions.CONSUMABLE_SUPPLY_READ) && (
            <Menu.Item key="detail">
              <Tooltip title="Hồ sơ vật tư">
                <Link to={`/supplies/detail/${item.id}`}>
                  <EyeFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
          {
            checkPermission(permissions.CONSUMABLE_SUPPLY_UPDATE) && <Menu.Item key="update_supplies">
              <Tooltip title="Cập nhật vật tư">
                <Link to={`/supplies/update/${item.id}`}>
                  <EditFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          }
          {
            checkPermission(permissions.CONSUMABLE_SUPPLY_DELETE) && <Menu.Item key="delete">
              <Tooltip title="Xóa vật tư">
                <Popconfirm
                  title="Bạn muốn xóa vật tư này?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <DeleteFilled />
                </Popconfirm>
              </Tooltip>
            </Menu.Item>
          }
        </Menu>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

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
    showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const handleDelete = (id: number) => {
    supplyApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          getSuppliesList();
          toast.success('Xóa thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
  };

  const getSuppliesList = () => {
    setLoading(true);
    supplyApi
      .list({
        page,
        limit,
        name: nameSearch,

      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(data.supplies.rows);
          setTotal(data.supplies.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getSuppliesList();
  }, [limit, page, nameSearch])
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH VẬT TƯ</div>
        <div className="flex flex-row gap-6">
          <Button className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2">
            <FileExcelFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
          </Button>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/supplies/import_excel_sp')}
          >
            <ImportOutlined />
            <div className="font-medium text-md text-[#5B69E6]">Nhập Excel</div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
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
        <div className="flex justify-end p-4">
          <Input
            placeholder="Tìm kiếm vật tư"
            allowClear
            value={name}
            className="input w-1/2"
            onChange={(e) => { setName(e.target.value) }}
          />
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={supllies}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default Suplly;
