import {
  DatePicker,
  Divider,
  // Pagination, Row,
  Select,
  Table,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import supplyApi from 'api/suplly.api';
import {
  exportToExcelReport,
  getDataExcel,
  getFields,
  getHeadersExcel,
  options,
} from 'utils/globalFunc.util';
import image from 'assets/image.png';
import moment from 'moment';
import warehouseApi from 'api/warehouse.api';
import ExportToExcel from 'components/Excel';
import { formatCurrencyVN } from 'utils/validateFunc.util';
import { supply_status } from 'constants/dataFake.constant';

// const TableFooter = ({ paginationProps }: any) => {
//   return (
//     <Row justify="space-between">
//       <div></div>
//       <Pagination {...paginationProps} />
//     </Row>
//   );
// };

const ReportSupplyByWarehouse = () => {
  const [startDate, setStartDate] = useState<any>(
    moment().subtract('months', 1)
  );
  const [endDate, setEndDate] = useState<any>(moment());
  const [supllies, setSupplies] = useState<any>([]);
  // const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<any>();
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
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      show: true,
      render(item: any) {
        return (
          <img
            src={item || image}
            alt="logo"
            className="w-full  aspect-square object-contain"
          />
        );
      },
      width: 100,
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'code',
      key: 'code',
      show: true,
      widthExcel: 15,
      width: 150,
    },
    {
      title: 'Số lô',
      dataIndex: 'lot_number',
      key: 'lot_number',
      show: true,
      widthExcel: 15,
      width: 150,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      width: 150,
      widthExcel: 30,
      render: (item: any) => (
        <p>
          {supply_status?.find((x: any) => x.value === item?.status)?.label}
        </p>
      ),
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiration_date',
      key: 'expiration_date',
      show: true,
      width: 150,
      widthExcel: 30,
      render: (item: any) => (
        <p>{moment(new Date(item)).format('DD/MM/YYYY')}</p>
      ),
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      widthExcel: 12,
      width: 100,
      render: (item: any) => <p>{item?.Equipment_Unit?.name}</p>,
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      dataIndex: 'unit_price',
      show: true,
      widthExcel: 20,
      width: 100,
      render: (item: any) => <p>{formatCurrencyVN(item)}</p>,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      widthExcel: 30,
      dataIndex: 'provider',
      width: 150,
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      show: true,
      widthExcel: 15,
      dataIndex: 'manufacturing_country',
      width: 100,
    },
    {
      title: 'Tồn đầu kỳ',
      key: 'begin_quantity',
      dataIndex: 'begin_quantity',
      show: true,
      widthExcel: 20,
      width: 100,
    },
    {
      title: 'Nhập trong kỳ',
      key: 'inbound_quantity',
      dataIndex: 'inbound_quantity',
      show: true,
      widthExcel: 20,
      width: 100,
    },
    {
      title: 'xuất trong kỳ',
      key: 'outbound_quantity',
      dataIndex: 'outbound_quantity',
      show: true,
      widthExcel: 20,
      width: 100,
    },
    {
      title: 'Tồn cuối kỳ',
      key: 'end_quantity',
      dataIndex: 'end_quantity',
      show: true,
      widthExcel: 20,
      width: 100,
    },
    {
      title: 'Tổng giá trị',
      key: 'valueTotal',
      show: true,
      widthExcel: 20,
      width: 200,
      render: (item: any) => (
        <p>{formatCurrencyVN(item?.unit_price * item?.end_quantity)}</p>
      ),
    },
  ];
  const columnTable = columns;

  // const onPaginationChange = (page: number) => {
  //   setPage(page);
  // };

  // const pagination = {
  //   current: page,
  //   total: total,
  //   pageSize: 10,
  //   showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
  //   onChange: onPaginationChange,
  // };

  const handleGetReportSupplies = (
    start: any,
    end: any,
    selectedWarehouse: any
  ) => {
    setLoading(true);
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
          const supplyData = data.result;
          if (status) {
            const supplies = supplyData.filter(
              (item: any) => item.status === status
            );
            setSupplies(supplies);
            setTotal(supplies.length);
          } else {
            setSupplies(supplyData);
            setTotal(data.count);
          }
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    handleGetReportSupplies(startDate, endDate, selectedWarehouse);
  }, [startDate, endDate, selectedWarehouse, status]);
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
      unit: x.Equipment_Unit?.name || '',
      unit_price: `${x?.unit_price}`
        .replace(/\./, '.')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      provider: x?.provider,
      manufacturing_country: x?.manufacturing_country,
      expiration_date: moment(new Date(x?.expiration_date)).format(
        'DD/MM/YYYY'
      ),
      begin_quantity: x.begin_quantity,
      status:
        supply_status.find((item) => item.value === x.status)?.label || '',
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
          <div className="w-[300px] flex gap-6 items-center">
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
              options={supply_status}
              value={status}
            />
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
      <p className="mt-5">{`Số lượng vật tư: ${total}`}</p>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={supllies}
        className="mt-6 shadow-md"
        // footer={() => <TableFooter paginationProps={pagination} />}
        // pagination={false}
        loading={loading}
        scroll={{ x: 2500, y: 600 }}
      />
    </div>
  );
};

export default ReportSupplyByWarehouse;
