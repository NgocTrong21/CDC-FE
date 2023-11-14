import {
  FileExcelFilled,
  ImportOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Pagination,
  Row,
  Table,
} from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';
import supplyApi from 'api/suplly.api';

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
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const nameSearch = useDebounce(name, 500);

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
  const [columnTable, _setColumnTable] = useState<any>(columns);

  const onPaginationChange = (page: number) => {
    setPage(page);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: 10,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
  };

  const handleGetReportSupplies = (start: any, end: any, search: any) => {
    supplyApi.getReportSupplies({
      data: {
        start_date: start,
        end_date: end,
        search: (search || '').trim()
      }
    }).then((res: any) => {
      const { success, data } = res.data;
      if (success) {
        const supplyData = data.result;
        setSupplies(supplyData);
        setTotal(data.count);
      }
    })
      .catch()
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    handleGetReportSupplies(startDate, endDate, nameSearch);
  }, [startDate, endDate, nameSearch])
  const handleSearchSupply = (value: string) => {
    setName(value)
  }

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
        <div className="flex justify-between">
          <div className='w-1/3'>
            <Input
              placeholder="Tìm kiếm vật tư"
              allowClear
              value={name}
              className="input"
              onChange={(e) => { handleSearchSupply(e.target.value) }}
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
