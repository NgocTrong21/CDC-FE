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
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';
import supplyApi from 'api/suplly.api';

import moment from 'moment';
import ExportToExcel from 'components/Excel';
import { exportToExcelPro, getDataExcel, getFields, getHeadersExcel } from 'utils/globalFunc.util';

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
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
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
      widthExcel: 15,
    },
    {
      title: 'Số lô',
      dataIndex: 'lot_number',
      key: 'lot_number',
      show: true,
      widthExcel: 15,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      dataIndex: 'unit',
      show: true,
      widthExcel: 12,
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      dataIndex: 'unit_price',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      widthExcel: 30,
      dataIndex: 'provider',
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      show: true,
      widthExcel: 15,
      dataIndex: 'manufacturing_country',
    },
    {
      title: 'Tồn đầu kỳ',
      key: 'begin_quantity',
      dataIndex: 'begin_quantity',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Nhập trong kỳ',
      key: 'inbound_quantity',
      dataIndex: 'inbound_quantity',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'xuất trong kỳ',
      key: 'outbound_quantity',
      dataIndex: 'outbound_quantity',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Tồn cuối kỳ',
      key: 'end_quantity',
      dataIndex: 'end_quantity',
      show: true,
      widthExcel: 20,
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
  const resolveDataExcel = (data: any, sheetName: string, columnTable: any) => {
    const fields: any = getFields(columnTable);
    const objectKey = Object.keys(data[0]);
    const newDatas: any = getDataExcel(data, objectKey, fields);
    const workSheetColumnName = fields?.map((item: any) => ({
      title: item?.title,
      width: item?.width,
    }));
    const workSheetName = sheetName;
    const fileName = `${sheetName} ${new Date()
      .toISOString()
      .substring(0, 10)}.xlsx`;
    const finalData: any = [workSheetColumnName, ...newDatas];
    const { myHeader, widths, newData } = getHeadersExcel(finalData);
    exportToExcelPro(
      newData,
      fileName,
      workSheetName,
      workSheetName,
      myHeader,
      widths
    );
  };
  const downloadEquipmentList = useCallback(async () => {
    setLoadingDownload(true);
    const res = await supplyApi.getReportSupplies({
      data: {
        start_date: startDate,
        end_date: endDate,
        search: (nameSearch || '').trim()
      }
    });
    const reportData = res?.data?.data?.result;
    const data = reportData.map((x: any) => ({
      code: x.code,
      lot_number: x.lot_number,
      name: x.name,
      unit: x.unit,
      unit_price: x?.unit_price,
      provider: x?.provider,
      department: x?.Department?.name,
      manufacturing_country: x?.manufacturing_country,
      begin_quantity: x.begin_quantity,
      inbound_quantity: x.inbound_quantity,
      outbound_quantity: x.outbound_quantity,
      end_quantity: x.end_quantity,
    }));
    resolveDataExcel(data, 'Báo cáo tồn kho', columnTable);
    setLoadingDownload(false);
  }, [startDate, endDate, nameSearch])
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">Thống kê tồn kho vật tư</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadEquipmentList}
            loading={loadingDownload}
          />
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