import { EyeFilled, FileWordFilled, SelectOutlined } from '@ant-design/icons';
import { Checkbox, Divider, Table, Tooltip } from 'antd';
import equipmentApi from 'api/equipment.api';
import equipmentTransferApi from 'api/equipment_transfer.api';

import ExportToExcel from 'components/Excel';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resolveDataExcel } from 'utils/globalFunc.util';

const HistoryTransfer = () => {

  const param: any = useParams();
  const { id } = param;
  const [equipment, setEquipment] = useState<any>({});
  const [transfer, setTransfer] = useState([]);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);

  const columns: any = [
    {
      title: 'Mã điều chuyển',
      dataIndex: 'code',
      key: 'code',
      show: true,
      widthExcel: 35,
    },
    {
      title: 'Ngày điều chuyển',
      key: 'transfer_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>
          {item?.transfer_date &&
            moment(item?.transfer_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Khoa phòng trước điều chuyển',
      key: 'from_department',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.from_department?.name}</>,
    },
    {
      title: 'Khoa phòng sau điều chuyển',
      key: 'to_department',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.to_department?.name}</>,
    },
    {
      title: 'Cán bộ lập phiếu',
      key: 'transfer_create_user',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.transfer_create_user?.name}</>,
    },
    {
      title: 'Cán bộ phê duyệt phiếu phiếu',
      key: 'transfer_approver',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.transfer_approver?.name}</>,
    },
    {
      title: 'Tài liệu điều chuyển',
      key: 'file',
      show: true,
      widthExcel: 25,
      render: (item: any) => {
        if(!item?.file) return (<div>Không có tài liệu đính kèm</div>)
        return (<a href={item?.file} download target='_blank' rel="noreferrer">
          <EyeFilled />
        </a>)
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Tooltip title="Chi tiết phiếu điều chuyển">
          <Link
            to={`/equipment/transfer/detail/${id}/${item.id}?edit=${false}`}
          >
            <FileWordFilled />
          </Link>
        </Tooltip>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  const onChangeCheckbox = (item: any, e: any) => {
    let newColumns: any = columnTable.map((column: any) => {
      if (item.title === column.title) {
        column.show = e.target.checked;
      }
      return column;
    });
    setColumnTable(newColumns);
  };

  const getDetailEquipment = (id: number) => {
    equipmentApi
      .detailBasic(id)
      .then((res: any) => {
        const { data } = res.data;
        setEquipment(data.equipment);
      })
      .catch();
  };

  const getHistoryTransfer = (id: number) => {
    setLoading(true);
    equipmentTransferApi
      .getHistoryTransfer(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setTransfer(data.transfer);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailEquipment(id);
    getHistoryTransfer(id);
  }, [id]);

  const downloadHistoryTransfer = async () => {
    setLoadingDownload(true);
    const res = await equipmentTransferApi.getHistoryTransfer(id);
    const transfer = res?.data?.data?.transfer;
    const data = transfer.map((x: any) => ({
      code: x?.code,
      transfer_date:
        x?.transfer_date && moment(x?.transfer_date).format('DD-MM-YYYY'),
      provider_id: x?.Provider?.name,
      repair_status: x?.Repair_Status?.name,
    }));
    resolveDataExcel(data, 'Lịch sử điều chuyển', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="title text-center">LỊCH SỬ ĐIỀU CHUYỂN THIẾT BỊ</div>
      <Divider />
      <div>
        <div className="mb-4 title">Thông tin thiết bị</div>
        <div className="flex flex-row gap-20">
          <div>
            <div>Tên: {equipment?.name}</div>
            <div>Model: {equipment?.model}</div>
          </div>
          <div>
            <div>Serial: {equipment?.serial}</div>
            <div>Khoa Phòng: {equipment?.Department?.name}</div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-row justify-between">
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
                      onChange={(e: any) => onChangeCheckbox(item, e)}
                    />
                    <div>{item?.title}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <ExportToExcel
          callback={downloadHistoryTransfer}
          loading={loadingDownload}
        />
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={transfer}
        className="mt-6 shadow-md"
        loading={loading}
      />
    </div>
  );
};

export default HistoryTransfer;
