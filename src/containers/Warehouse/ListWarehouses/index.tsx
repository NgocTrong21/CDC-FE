import { useEffect, useState } from 'react';
import { EditFilled, EyeFilled, FilterFilled } from '@ant-design/icons';
import { Divider, Input, Pagination, Row, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { checkPermission } from 'utils/globalFunc.util';
import warehouseApi from 'api/warehouse.api';
import { permissions } from 'constants/permission.constant';

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Warehouses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const [warehouses, setWarehouses] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const nameSearch = useDebounce(name, 500);
  const seachWarehouses = (params: any) => {
    const { nameSearch, limit, page } = params;
    setLoading(true);
    warehouseApi
      .search({
        name: nameSearch,
        limit,
        page,
      })
      .then((res) => {
        const { success, data } = res.data;
        if (success) {
          setWarehouses(data?.warehouses.rows || []);
          setTotal(data?.warehouses.count || 0);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    seachWarehouses({
      nameSearch,
      page,
      limit,
    });
  }, [page, nameSearch]);
  // const handleDelete = (id: number) => {
  //   warehouseApi
  //     .delete(id)
  //     .then((res: any) => {
  //       const { success, message } = res.data;
  //       if (success) {
  //         seachWarehouses({
  //           nameSearch,
  //           page,
  //           limit
  //         })
  //         toast.success('Xóa thành công!');
  //       } else {
  //         toast.error(message);
  //       }
  //     })
  //     .catch((error) => toast.error(error));
  // };
  const columns: any = [
    {
      title: 'Mã kho',
      key: 'code',
      dataIndex: 'code',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Thủ kho',
      key: 'storekeeper',
      dataIndex: 'storekeeper',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <div>
          {checkPermission(permissions.WAREHOUSES_MANAGEMENT_UPDATE) && (
            <Tooltip className="mr-4" title="Cập nhật thông tin kho">
              <Link to={`/warehouses/update_warehouse/${item.id}`}>
                <EditFilled />
              </Link>
            </Tooltip>
          )}
          {checkPermission(permissions.WAREHOUSES_MANAGEMENT_READ) && (
            <Tooltip title="Hồ sơ vật tư">
              <Link to={`/warehouses/detail_warehouse/${item.id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const columnTable = columns;
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    navigate(`${pathName}?page=${page}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} Kho`,
    onChange: onPaginationChange,
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
        <div className="title">DANH SÁCH KHO</div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        {/* <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div> */}
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder="Tìm kiếm kho"
            allowClear
            value={name}
            className="rounded-lg h-9 border-[#A3ABEB] border-2"
            onChange={(e) => onChangeSearch(e)}
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={warehouses}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default Warehouses;
