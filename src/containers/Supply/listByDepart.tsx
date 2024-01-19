import {
  // DeleteFilled,
  EditFilled,
  EyeFilled,
  // FileExcelFilled,
  ImportOutlined,
  // SelectOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  // Checkbox,
  Input,
  Menu,
  Pagination,
  // Popconfirm,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { useState, useEffect, useContext } from 'react';
import image from 'assets/image.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import useDebounce from 'hooks/useDebounce';
import supplyApi from 'api/suplly.api';
// import { toast } from 'react-toastify';
import {
  checkPermission,
  options,
  // onChangeCheckbox,
  resolveDataExcel,
} from 'utils/globalFunc.util';

import type { PaginationProps } from 'antd';
import { permissions } from 'constants/permission.constant';
import { formatCurrencyVN } from 'utils/validateFunc.util';
import ExportToExcel from 'components/Excel';
import { FilterContext } from 'contexts/filter.context';
import { supply_status } from 'constants/dataFake.constant';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const SuppliesByDepart = () => {
  const { departments } = useContext(FilterContext);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(1);
  const navigate = useNavigate();
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
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
  const handleSetDepartment = (data: any) => {
    setSelectedDepartment(data);
  };
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      show: true,
      render(item: any) {
        return (
          <img
            src={item?.Supply?.image || image}
            alt="logo"
            className="w-full  aspect-square object-contain"
          />
        );
      },
      width: 120,
    },
    {
      title: 'Mã vật tư',
      key: 'code',
      show: true,
      widthExcel: 15,
      width: 150,
      render(item: any) {
        return <p>{item?.Supply?.code}</p>;
      },
    },
    {
      title: 'Số lô',
      key: 'lot_number',
      show: true,
      widthExcel: 15,
      width: 150,
      render(item: any) {
        return <p>{item?.Supply?.lot_number}</p>;
      },
    },
    {
      title: 'Tên vật tư',
      key: 'name',
      show: true,
      widthExcel: 30,
      width: 200,
      render(item: any) {
        return <p>{item?.Supply?.name}</p>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      width: 150,
      widthExcel: 30,
      render: (item: any) => (
        <p>
          {
            supply_status?.find((x: any) => x.value === item?.Supply?.status)
              ?.label
          }
        </p>
      ),
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      widthExcel: 12,
      width: 100,
      render(item: any) {
        return <p>{item?.Supply?.Equipment_Unit?.name}</p>;
      },
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      show: true,
      widthExcel: 20,
      width: 120,
      render(item: any) {
        return <p>{item?.Supply?.unit_price}</p>;
      },
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      widthExcel: 30,
      width: 150,
      render(item: any) {
        return <p>{item?.Supply?.provider}</p>;
      },
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      show: true,
      widthExcel: 15,
      width: 120,
      render(item: any) {
        return <p>{item?.Supply?.manufacturing_country}</p>;
      },
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      show: true,
      widthExcel: 20,
      width: 120,
      render(item: any) {
        return <p>{item?.quantity}</p>;
      },
    },
    {
      title: 'Tổng giá trị',
      key: 'valueTotal',
      show: true,
      widthExcel: 20,
      width: 200,
      render: (item: any) => (
        <p>{formatCurrencyVN(item?.Supply?.unit_price * item?.quantity)}</p>
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
    showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  // const handleDelete = (id: number) => {
  //   supplyApi
  //     .delete(id)
  //     .then((res: any) => {
  //       const { success, message } = res.data;
  //       if (success) {
  //         getSuppliesList();
  //         toast.success('Xóa thành công!');
  //       } else {
  //         toast.error(message);
  //       }
  //     })
  //     .catch((error) => toast.error(error));
  // };

  const getSuppliesList = () => {
    setLoading(true);
    supplyApi
      .listByDepart({
        page,
        limit,
        name: nameSearch,
        department_id: selectedDepartment,
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
  }, [limit, page, nameSearch, selectedDepartment]);
  const downloadSuppliesList = async () => {
    setLoadingDownload(true);
    const data = supllies.map((x: any) => ({
      code: x?.Supply?.code,
      lot_number: x?.Supply?.lot_number,
      name: x?.Supply?.name,
      unit: x?.Supply?.Equipment_Unit?.name,
      unit_price: `${x?.Supply?.unit_price}`
        .replace(/\./, '.')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      provider: x?.Supply?.provider,
      manufacturing_country: x?.Supply?.manufacturing_country,
      quantity: x?.quantity,
      valueTotal: ` ${x?.Supply?.unit_price * x?.quantity || 0}`
        .replace(/\./, '.')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    }));
    resolveDataExcel(
      data,
      `Danh sách vật tư trong khoa phòng ${
        options(departments).find(
          (item: any) => item.value === selectedDepartment
        )?.label
      }`,
      columnTable
    );
    setLoadingDownload(false);
  };
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH VẬT TƯ THEO KHOA PHÒNG</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadSuppliesList}
            loading={loadingDownload}
          />
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
        {/* <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div> */}
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
        <div className="flex justify-between p-4">
          <Select
            className="w-96"
            placeholder="Kho hàng"
            options={options(departments)}
            onSelect={handleSetDepartment}
            value={selectedDepartment}
          />
          <Input
            placeholder="Tìm kiếm vật tư"
            allowClear
            value={name}
            className="input w-1/2"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={supllies}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        scroll={{ x: 2000, y: 600 }}
        loading={loading}
      />
    </div>
  );
};

export default SuppliesByDepart;
