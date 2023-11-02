import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  FileExcelFilled,
  FilterFilled,
  ImportOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
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
import { onChangeCheckbox } from 'utils/globalFunc.util';

import type { PaginationProps } from 'antd';
import moment from 'moment';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const ReportSupply = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<any>(moment().subtract('months', 1));
  const [endDate, setEndDate] = useState<any>(moment());
  const [supllies, setSupplies] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const currentType = query?.type_id;
  const currentLevel = query?.risk_level;
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentLevel);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [types, setTypes] = useState<any>([]);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const columns: any = [
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
      dataIndex: 'unit',
      show: true,
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      dataIndex: 'unit_price',
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
      title: 'Tồn đầu kỳ',
      key: 'begin_quantity',
      dataIndex: 'begin_quantity',
      show: true,
    },
    {
      title: 'Nhập trong kỳ',
      key: 'inbound_quantity',
      dataIndex: 'inbound_quantity',
      show: true,
    },
    {
      title: 'xuất trong kỳ',
      key: 'outbound_quantity',
      dataIndex: 'outbound_quantity',
      show: true,
    },
    {
      title: 'Tồn cuối kỳ',
      key: 'end_quantity',
      dataIndex: 'end_quantity',
      show: true,
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
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const handleGetReportSupplies = (start: any, end: any) => {
    supplyApi.getReportSupplies({
      data: {
        start_date: start,
        end_date: end,
      }
    }).then((res: any) => {
      const { success, data } = res.data;
      if (success) {
        setSupplies(data.result);
      }
    })
      .catch()
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    handleGetReportSupplies(startDate, endDate);
  }, [startDate, endDate])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">Thống kê tồn kho vật tư</div>
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
        <div className="flex justify-between">
          <div className='w-1/3'>
            <Input
              placeholder="Tìm kiếm vật tư"
              allowClear
              value={name}
              className="input"
              onChange={() => { }}
            />
          </div>
          <div className='flex gap-10 w-1/3'>
            <DatePicker value={startDate} className="date" placeholder='Nhập đầu kỳ' onChange={(e) => { setStartDate(moment(new Date(e as any))) }} />
            <DatePicker value={endDate} className="date" placeholder='Nhập cuối kỳ' onChange={(e) => { setEndDate(moment(new Date(e as any))) }} />
          </div>
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

export default ReportSupply;
