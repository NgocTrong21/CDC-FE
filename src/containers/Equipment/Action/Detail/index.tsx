import { useState, useEffect } from 'react';
import {
  EyeFilled,
  FilePdfFilled,
  FileWordFilled,
  EditFilled,
} from '@ant-design/icons';
import { Button, Divider, Table, Tooltip } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import qrcode from 'assets/qrcode.png';
import type { ColumnsType } from 'antd/es/table';
import equipmentApi from 'api/equipment.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import moment from 'moment';
import { downloadRepairSchedule } from 'utils/file.util';
import Loading from 'components/Loading';
import {
  getCurrentUser,
  formatCurrency,
  checkPermission,
} from 'utils/globalFunc.util';
import { formatCurrencyVN } from 'utils/validateFunc.util';
import equipmentTransferApi from 'api/equipment_transfer.api';
import { permissions } from 'constants/permission.constant';
import equipmentLiquidationApi from 'api/equipment_liquidation.api';
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const Detail = () => {
  const params = useParams();
  const current_user: any = getCurrentUser();
  const navigate = useNavigate();
  const { id } = params;
  const [equipment, setEquipment] = useState<any>({});
  const [repairInfo, setRepairInfo] = useState([]);
  const [transfer, setTransfer] = useState([]);
  const [liquidation, setLiquidation] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns: ColumnsType<DataType> = [
    {
      title: 'Trường',
      dataIndex: 'key_1',
      key: 'key_1',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value_1',
      key: 'value_1',
    },
    {
      title: 'Trường',
      dataIndex: 'key_2',
      key: 'key_2',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value_2',
      key: 'value_2',
    },
  ];

  const columns_repair: any = [
    // {
    //   title: 'Mã sửa chữa',
    //   dataIndex: 'code',
    //   key: 'code',
    // },
    {
      title: 'Ngày báo hỏng',
      key: 'broken_report_date',
      render: (item: any) => (
        <>
          {item?.broken_report_date &&
            moment(item?.broken_report_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Ngày lập kế hoạch sửa chữa',
      key: 'schedule_repair_date',
      render: (item: any) => (
        <>
          {item?.schedule_repair_date &&
            moment(item?.schedule_repair_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Ngày sửa chữa',
      key: 'repair_date',
      render: (item: any) => (
        <>
          {item?.repair_date && moment(item?.repair_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Ngày hoàn thành sửa chữa',
      key: 'repair_completion_date',
      render: (item: any) => (
        <>
          {item?.repair_completion_date &&
            moment(item?.repair_completion_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Chi phí dự kiến',
      key: 'estimated_repair_cost',
      render: (item: any) => (
        <>{formatCurrencyVN(item?.estimated_repair_cost)}</>
      ),
    },
    {
      title: 'Chi phí thực tế',
      key: 'actual_repair_cost',
      render: (item: any) => <>{formatCurrencyVN(item?.actual_repair_cost)}</>,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      dataIndex: 'provider',
    },
    {
      title: 'Tình trạng thiết bị',
      key: 'repair_status',
      render: (item: any) => <>{item?.Repair_Status?.name}</>,
    },
    // {
    //   title: 'Biên bản sửa chữa',
    //   key: 'repair_word',
    //   render: (item: any) => {
    //     const schedule = {
    //       id: item?.id,
    //       equipment_id: item?.equipment_id,
    //       name: equipment?.name,
    //       model: equipment?.model,
    //       serial: equipment?.serial,
    //       department: equipment?.Department.name,
    //       actual_repair_cost: item?.actual_repair_cost,
    //       code: item?.code,
    //       repair_date: item?.repair_date && moment(item?.repair_date),
    //       estimated_repair_cost: item?.estimated_repair_cost,
    //       provider_id: item?.provider_id,
    //       repair_completion_date:
    //         item?.repair_completion_date &&
    //         moment(item?.repair_completion_date),
    //       repair_status: item?.repair_status,
    //       repair_status_name: item?.Repair_Status?.name,
    //       schedule_repair_date:
    //         item?.schedule_repair_date && moment(item?.schedule_repair_date),
    //       schedule_create_user_name: item?.schedule_create_user?.name,
    //       schedule_create_user_id: item?.schedule_create_user?.id,
    //       test_user_name: item?.test_user?.name || current_user?.name,
    //       test_user_id: item?.test_user?.id || current_user?.id,
    //       schedule_approve_user_name:
    //         item?.schedule_approve_user?.name || current_user?.name,
    //       schedule_approve_user_id:
    //         item?.schedule_approve_user?.id || current_user?.id,
    //       schedule_repair_status: item?.schedule_repair_status,
    //     };
    //     return item.done ? (
    //       <FileWordFilled onClick={() => downloadRepairSchedule(schedule)} />
    //     ) : (
    //       <div>Chưa bàn giao</div>
    //     );
    //   },
    // },
    // {
    //   title: 'Tài liệu đính kèm',
    //   key: 'file',
    //   render: (item: any) => {
    //     if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
    //     return (
    //       <a href={item?.file} download target="_blank" rel="noreferrer">
    //         <EyeFilled />
    //       </a>
    //     );
    //   },
    // },
  ];

  const columns_tranfer: any = [
    // {
    //   title: 'Mã điều chuyển',
    //   dataIndex: 'code',
    //   key: 'code',
    //   show: true,
    //   widthExcel: 35,
    // },
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
    // {
    //   title: 'Tài liệu điều chuyển',
    //   key: 'file',
    //   show: true,
    //   widthExcel: 25,
    //   render: (item: any) => {
    //     if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
    //     return (
    //       <a href={item?.file} download target="_blank" rel="noreferrer">
    //         <EyeFilled />
    //       </a>
    //     );
    //   },
    // },
    // {
    //   title: 'Tác vụ',
    //   key: 'action',
    //   show: true,
    //   render: (item: any) => (
    //     <Tooltip title="Chi tiết phiếu điều chuyển">
    //       <Link
    //         to={`/equipment/transfer/detail/${id}/${item.id}?edit=${false}`}
    //       >
    //         <FileWordFilled />
    //       </Link>
    //     </Tooltip>
    //   ),
    // },
  ];

  const columns_liquidation: any = [
    // {
    //   title: 'Mã thanh lý',
    //   dataIndex: 'code',
    //   key: 'code',
    //   show: true,
    //   widthExcel: 35,
    // },
    {
      title: 'Ngày thanh lý',
      key: 'liquidation_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>
          {item?.liquidation_date &&
            moment(item?.liquidation_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Cán bộ lập phiếu',
      key: 'create_user',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.create_user?.name}</>,
    },
    {
      title: 'Cán bộ phê duyệt phiếu phiếu',
      key: 'approver',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.approver?.name}</>,
    },
    // {
    //   title: 'Tài liệu thanh lý',
    //   key: 'file',
    //   show: true,
    //   widthExcel: 25,
    //   render: (item: any) => {
    //     if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
    //     return (
    //       <a href={item?.file} download target="_blank" rel="noreferrer">
    //         <EyeFilled />
    //       </a>
    //     );
    //   },
    // },
    // {
    //   title: 'Tác vụ',
    //   key: 'action',
    //   show: true,
    //   render: (item: any) => (
    //     <Tooltip title="Chi tiết phiếu thanh lý">
    //       <Link
    //         to={`/equipment/liquidation/detail/${id}/${item.id}?edit=${false}`}
    //       >
    //         <FileWordFilled />
    //       </Link>
    //     </Tooltip>
    //   ),
    // },
  ];
  const getDetailEquipment = (id: any) => {
    setLoading(true);
    equipmentApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipment(data.equipment);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  const getHistoryRepair = (id: any) => {
    equipmentRepairApi
      .getHistoryRepair(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setRepairInfo(data.equipment);
        }
      })
      .catch();
  };

  const getHistoryTransfer = (id: any) => {
    equipmentTransferApi
      .getHistoryTransfer(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setTransfer(data.transfer);
        }
      })
      .catch();
  };

  const getHistoryLiquidation = (id: any) => {
    equipmentLiquidationApi
      .getHistoryLiquidation(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setLiquidation(data.liquidation);
        }
      })
      .catch();
  };

  useEffect(() => {
    getDetailEquipment(id);
    getHistoryRepair(id);
    getHistoryTransfer(id);
    getHistoryLiquidation(id);
  }, [id]);

  const data: DataType[] = [
    {
      key_1: 'Khoa - Phòng',
      value_1: `${
        equipment?.Department?.name ? equipment.Department?.name : ''
      }`,
      key_2: 'Trạng thái',
      value_2: `${
        equipment?.Equipment_Status?.name
          ? equipment.Equipment_Status?.name
          : ''
      }`,
    },
    {
      key_1: 'Model',
      value_1: `${equipment?.model ? equipment?.model : ''}`,
      key_2: 'Serial',
      value_2: `${equipment?.serial ? equipment?.serial : ''}`,
    },
    {
      key_1: 'Năm sử dụng',
      value_1: `${equipment?.year_in_use ? equipment?.year_in_use : ''}`,
      key_2: 'Số hiệu TSCĐ',
      value_2: `${
        equipment?.fixed_asset_number ? equipment?.fixed_asset_number : ''
      }`,
    },

    {
      key_1: 'Đơn vị tính',
      value_1: `${
        equipment?.Equipment_Unit?.name ? equipment?.Equipment_Unit?.name : ''
      }`,
      key_2: 'Thành tiền',
      value_2: `${
        equipment?.initial_value ? formatCurrency(equipment?.initial_value) : ''
      }`,
    },
    {
      key_1: 'Khấu hao hàng năm',
      value_1: `${
        equipment?.annual_depreciation
          ? equipment?.annual_depreciation + '%'
          : ''
      }`,
      key_2: 'Giá trị còn lại',
      value_2: `${
        equipment?.residual_value
          ? formatCurrency(equipment?.residual_value)
          : ''
      }`,
    },
    {
      key_1: 'Nước sản xuất',
      value_1: `${
        equipment?.manufacturing_country_id
          ? equipment?.manufacturing_country_id
          : ''
      }`,
      key_2: 'Ghi chú',
      value_2: `${equipment?.note ? equipment.note : ''}`,
    },
    {
      key_1: 'Năm sản xuất',
      value_1: equipment.year_of_manufacture,
      key_2: 'Ngày bàn giao',
      value_2: `${
        equipment.handover_date !== null
          ? moment(equipment.handover_date).format('HH:mm:ss DD/MM/YYYY')
          : ''
      }`,
    },
    {
      key_1: 'Ngày tạo',
      value_1: `${moment(equipment?.createdAt).format('HH:mm:ss DD/MM/YYYY')}`,
      key_2: 'Ngày cập nhật gần nhất',
      value_2: `${moment(equipment?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}`,
    },
  ];

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ THIẾT BỊ</div>
        <div className="flex flex-row gap-6">
          {/* <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button> */}
          <Button
            className={`${
              checkPermission(permissions.EQUIPMENT_UPDATE)
                ? 'button_excel'
                : 'hidden'
            }`}
            onClick={() => navigate(`/equipment/update/${equipment.id}`)}
          >
            <EditFilled />
            <div className="font-medium text-md text-[#5B69E6]">
              Cập nhật thiết bị
            </div>
          </Button>
        </div>
      </div>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <div id="detail" className="">
          <div className="flex flex-row gap-6 my-8">
            <div className="basis-3/4">
              <div className="font-bold text-2xl">{equipment?.name}</div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="shadow-md mt-4"
              />
            </div>
            <div className="flex flex-col gap-4 items-center basis-1/4 ">
              <div className="text-center leading-9">Hình ảnh thiết bị</div>
              <img
                src={equipment?.image || image}
                className="rounded-lg w-52 h-52 mb-9"
                alt="Ảnh thiết bị"
              />
              {/* <div className="text-center leading-9">Mã QR code thiết bị</div>
              <img
                src={equipment?.qrcode || qrcode}
                width={200}
                className="rounded-lg w-52 h-52 "
                alt="Mã QR code thiết bị"
              /> */}
            </div>
          </div>
          <Divider />
          <div>
            <div className="text-center font-bold text-2xl mb-9">
              Thống kê lịch sử hoạt động của thiết bị
            </div>
            <div className="mb-10">
              <div className="font-bold text-xl mb-6">Lịch sử sửa chữa</div>
              <Table
                columns={columns_repair}
                dataSource={repairInfo}
                pagination={false}
                className="shadow-md"
              />
            </div>
            <div className="mb-10">
              <div className="font-bold text-xl mb-6">Lịch sử điều chuyển</div>
              <Table
                columns={columns_tranfer}
                dataSource={transfer}
                pagination={false}
                className="shadow-md"
              />
            </div>
            <div className="mb-10">
              <div className="font-bold text-xl mb-6">Lịch sử thanh lý</div>
              <Table
                columns={columns_liquidation}
                dataSource={liquidation}
                pagination={false}
                className="shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
