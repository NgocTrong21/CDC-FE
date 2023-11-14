import {
  FileExcelFilled,
  ImportOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Divider,
  Pagination,
  Row,
  Select,
  Table,
} from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supplyApi from 'api/suplly.api';
import { options } from 'utils/globalFunc.util';

import moment from 'moment';
import warehouseApi from 'api/warehouse.api';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const ReportSupplyByWarehouse = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<any>(moment().subtract('months', 1));
  const [endDate, setEndDate] = useState<any>(moment());
  const [supllies, setSupplies] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const seachWarehouses = () => {
    warehouseApi.search({
    })
      .then((res) => {
        const { success, data } = res.data;
        if (success && data?.warehouses) {
          setWarehouses(data?.warehouses);
        }
      })
      .catch()
  }
  useEffect(() => {
    seachWarehouses();
  }, [])

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
    showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
    onChange: onPaginationChange,
  };

  const handleGetReportSupplies = (start: any, end: any, selectedWarehouse: any) => {
    supplyApi.getReportSuppliesByWarehouse({
      data: {
        start_date: start,
        end_date: end,
        warehouseId: selectedWarehouse
      }
    }).then((res: any) => {
      const { success, data } = res.data;
      if (success) {
        setSupplies(data.result);
        setTotal(data.count);
      }
    })
      .catch()
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    handleGetReportSupplies(startDate, endDate, selectedWarehouse);
  }, [startDate, endDate, selectedWarehouse])
  const handleSetSupplies = (data: any) => {
    setSelectedWarehouse(data);
  }
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">Thống kê vật tư tồn theo kho</div>
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
          <div className='w-[500px]'>
            <Select
              className='w-full'
              placeholder="Kho hàng"
              options={options(warehouses)}
              onSelect={handleSetSupplies}
              value={selectedWarehouse}
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

export default ReportSupplyByWarehouse;
