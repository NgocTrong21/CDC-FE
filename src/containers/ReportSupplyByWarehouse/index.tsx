import {
  DatePicker,
  Divider,
  InputNumber,
  Pagination,
  Row,
  Select,
  Table,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supplyApi from 'api/suplly.api';
import {
  exportToExcelReport,
  getDataExcel,
  getFields,
  getHeadersExcel,
  options,
} from 'utils/globalFunc.util';

import moment from 'moment';
import warehouseApi from 'api/warehouse.api';
import ExportToExcel from 'components/Excel';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const ReportSupplyByWarehouse = () => {
  const [startDate, setStartDate] = useState<any>(
    moment().subtract('months', 1)
  );
  const [endDate, setEndDate] = useState<any>(moment());
  const [supllies, setSupplies] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [warehouses, setWarehouses] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const seachWarehouses = () => {
    warehouseApi
      .search({})
      .then((res) => {
        const { success, data } = res.data;
        if (success && data?.warehouses) {
          setWarehouses(data?.warehouses);
        }
      })
      .catch();
  };
  useEffect(() => {
    seachWarehouses();
  }, []);

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
      show: false,
      widthExcel: 30,
      dataIndex: 'provider',
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      show: false,
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
    {
      title: 'Tổng giá trị',
      key: 'valueTotal',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>
          <InputNumber
            value={parseFloat(
              (item?.unit_price * item?.end_quantity)?.toFixed(1)
            )}
            formatter={(value) =>
              ` ${value}`
                .replace(/\./, '.')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            precision={1}
            disabled
            className="text-black"
          />
        </div>
      ),
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

  const handleGetReportSupplies = (
    start: any,
    end: any,
    selectedWarehouse: any
  ) => {
    supplyApi
      .getReportSuppliesByWarehouse({
        data: {
          start_date: start,
          end_date: end,
          warehouseId: selectedWarehouse,
        },
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(data.result);
          setTotal(data.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    handleGetReportSupplies(startDate, endDate, selectedWarehouse);
  }, [startDate, endDate, selectedWarehouse]);
  const handleSetSupplies = (data: any) => {
    setSelectedWarehouse(data);
  };
  const resolveDataExcel = (
    data: any,
    sheetName: string,
    columnTable: any,
    reportData: any
  ) => {
    const {
      codeWarehouse,
      warehouseName,
      startedDate,
      endedDate,
      warehouseValue,
    } = reportData;
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
    exportToExcelReport(
      newData,
      fileName,
      workSheetName,
      workSheetName,
      myHeader,
      widths,
      warehouseName,
      codeWarehouse,
      startedDate,
      endedDate,
      warehouseValue
    );
  };
  const downloadEquipmentList = useCallback(async () => {
    setLoadingDownload(true);
    const data = supllies.map((x: any) => ({
      code: x.code,
      lot_number: x.lot_number,
      name: x.name,
      unit: x.unit,
      unit_price: `${x?.unit_price}`
        .replace(/\./, '.')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      provider: x?.provider,
      manufacturing_country: x?.manufacturing_country,
      begin_quantity: x.begin_quantity,
      inbound_quantity: x.inbound_quantity,
      outbound_quantity: x.outbound_quantity,
      end_quantity: x.end_quantity,
      valueTotal: ` ${x.unit_price * x.end_quantity || 0}`
        .replace(/\./, '.')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    }));
    const reportDataDetail = {
      warehouseName: (
        warehouses.find((item: any) => item?.id === selectedWarehouse) as any
      )?.name,
      codeWarehouse: (
        warehouses.find((item: any) => item?.id === selectedWarehouse) as any
      )?.code,
      startedDate: moment(startDate).format('DD-MM-YYYY'),
      endedDate: moment(endDate).format('DD-MM-YYYY'),
      warehouseValue: supllies.reduce((total: any, current: any) => {
        return total + Number(current.unit_price * current.end_quantity || 0);
      }, 0),
    };
    resolveDataExcel(data, 'Báo cáo tồn kho', columnTable, reportDataDetail);
    setLoadingDownload(false);
  }, [startDate, endDate, supllies, selectedWarehouse, warehouses]);
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">Thống kê vật tư tồn theo kho</div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-row gap-6">
            <ExportToExcel
              callback={downloadEquipmentList}
              loading={loadingDownload}
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        <div className="flex justify-between">
          <div className="w-[500px]">
            <Select
              className="w-full"
              placeholder="Kho hàng"
              options={options(warehouses)}
              onSelect={handleSetSupplies}
              value={selectedWarehouse}
            />
          </div>
          <div className="flex gap-10 w-1/3">
            <DatePicker
              value={startDate}
              className="date"
              placeholder="Nhập đầu kỳ"
              onChange={(e) => {
                setStartDate(moment(new Date(e as any)));
              }}
            />
            <DatePicker
              value={endDate}
              className="date"
              placeholder="Nhập cuối kỳ"
              onChange={(e) => {
                setEndDate(moment(new Date(e as any)));
              }}
            />
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
