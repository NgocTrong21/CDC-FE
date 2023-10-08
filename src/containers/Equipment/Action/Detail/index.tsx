import { useState, useEffect } from 'react';
import {
  DownloadOutlined,
  EyeFilled,
  FilePdfFilled,
  FileWordFilled,
  EditFilled,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Divider, Image, Space, Table, Tooltip } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import qrcode from 'assets/qrcode.png';
import type { ColumnsType } from 'antd/es/table';
import equipmentApi from 'api/equipment.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import moment from 'moment';
import equipmentHandoverApi from 'api/equipment_handover.api';
import { downloadHandoverDocx, downloadRepairSchedule } from 'utils/file.util';
import Loading from 'components/Loading';
import {
  getCurrentUser,
  formatCurrency,
  checkPermission,
} from 'utils/globalFunc.util';
import equipmentInspectionApi from 'api/equipment_inspection.api';
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
  const [supplies, setSupplies] = useState([]);
  const [handoverInfo, setHandoverInfo] = useState([]);
  const [inspection, setInspection] = useState([]);
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

  const columns_supply: any = [
    {
      title: 'Tên vật tư',
      key: 'name',
      render: (item: any) => <>{item?.Supply?.name}</>,
    },
    {
      title: 'Code',
      key: 'code',
      render: (item: any) => <>{item?.Supply?.code}</>,
    },
    {
      title: 'Năm sản xuất',
      key: 'year_of_manufacture',
      render: (item: any) => <>{item?.Supply?.year_of_manufacture}</>,
    },
    {
      title: 'Năm sử dụng',
      key: 'year_in_use',
      render: (item: any) => <>{item?.Supply?.year_in_use}</>,
    },
    {
      title: 'Số lượng vật tư đi kèm thiết bị',
      key: 'count',
      render: (item: any) => <>{item?.count}</>,
    },
  ];

  const columns_handover: any = [
    {
      title: 'Tên thiết bị',
      key: 'name',
      render: (item: any) => <>{item?.Equipment?.name}</>,
    },
    {
      title: 'Ngày bàn giao',
      key: 'handover_date',
      render: (item: any) => (
        <>
          {item?.handover_date &&
            moment(item?.handover_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Cán bộ phụ trách',
      key: 'handover_in_charge',
      render: (item: any) => <>{item?.handover_in_charge?.name}</>,
    },
    {
      title: 'Cán bộ lập biên bản',
      key: 'handover_create',
      render: (item: any) => <>{item?.handover_create?.name}</>,
    },
    {
      title: 'Khoa Phòng nhận bàn giao',
      key: 'department',
      render: (item: any) => <>{item?.Department?.name}</>,
    },
    {
      title: 'Biên bản bàn giao',
      key: 'handover_report',
      render: (item: any) => (
        <FileWordFilled onClick={() => downloadHandoverInfo(item)} />
      ),
    },
    {
      title: 'Tài liệu đính kèm',
      key: 'file',
      render: (item: any) => {
        if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
        return (
          <a href={item?.file} download target="_blank" rel="noreferrer">
            <EyeFilled />
          </a>
        );
      },
    },
  ];

  const columns_repair: any = [
    {
      title: 'Mã sửa chữa',
      dataIndex: 'code',
      key: 'code',
    },
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
      key: 'provider_id',
      render: (item: any) => <>{item?.Provider?.name}</>,
    },
    {
      title: 'Tình trạng thiết bị',
      key: 'repair_status',
      render: (item: any) => <>{item?.Repair_Status?.name}</>,
    },
    {
      title: 'Biên bản sửa chữa',
      key: 'repair_word',
      render: (item: any) => {
        const schedule = {
          id: item?.id,
          equipment_id: item?.equipment_id,
          name: equipment?.name,
          model: equipment?.model,
          serial: equipment?.serial,
          department: equipment?.Department.name,
          actual_repair_cost: item?.actual_repair_cost,
          code: item?.code,
          repair_date: item?.repair_date && moment(item?.repair_date),
          estimated_repair_cost: item?.estimated_repair_cost,
          provider_id: item?.provider_id,
          repair_completion_date:
            item?.repair_completion_date &&
            moment(item?.repair_completion_date),
          repair_status: item?.repair_status,
          repair_status_name: item?.Repair_Status?.name,
          schedule_repair_date:
            item?.schedule_repair_date && moment(item?.schedule_repair_date),
          schedule_create_user_name: item?.schedule_create_user?.name,
          schedule_create_user_id: item?.schedule_create_user?.id,
          test_user_name: item?.test_user?.name || current_user?.name,
          test_user_id: item?.test_user?.id || current_user?.id,
          schedule_approve_user_name:
            item?.schedule_approve_user?.name || current_user?.name,
          schedule_approve_user_id:
            item?.schedule_approve_user?.id || current_user?.id,
          schedule_repair_status: item?.schedule_repair_status,
        };
        return item.done ? (
          <FileWordFilled onClick={() => downloadRepairSchedule(schedule)} />
        ) : (
          <div>Chưa bàn giao</div>
        );
      },
    },
    {
      title: 'Tài liệu đính kèm',
      key: 'file',
      render: (item: any) => {
        if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
        return (
          <a href={item?.file} download target="_blank" rel="noreferrer">
            <EyeFilled />
          </a>
        );
      },
    },
  ];

  const columns_inspection: any = [
    {
      title: 'Mã kiểm định',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Ngày kiểm định',
      key: 'inspection_date',
      render: (item: any) => (
        <>
          {item?.inspection_date &&
            moment(item?.inspection_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Cán bộ tạo phiếu',
      key: 'inspection_create_user',
      render: (item: any) => <>{item?.inspection_create_user?.name}</>,
    },
    {
      title: 'Cán bộ phê duyệt',
      key: 'inspection_approve_user',
      render: (item: any) => <>{item?.inspection_approve_user?.name}</>,
    },
    {
      title: 'Biên bản kiểm định',
      key: 'inspection_report',
      render: (item: any) => (
        <Link
          to={`/equipment/inspection/detail/${id}/${item.id}?edit=${false}`}
        >
          <FileWordFilled />
        </Link>
      ),
    },
    {
      title: 'Tài liệu đính kèm',
      key: 'file',
      render: (item: any) => {
        if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
        return (
          <a href={item?.file} download target="_blank" rel="noreferrer">
            <EyeFilled />
          </a>
        );
      },
    },
  ];

  const columns_insurance: any = [
    {
      title: 'Đơn vị bảo hành',
      dataIndex: 'insurance_unit',
      key: 'insurance_unit',
    },
    {
      title: 'Nội dung bảo hành',
      dataIndex: 'insurance_note',
      key: 'insurance_note',
    },
    {
      title: 'Thời gian bảo hành',
      dataIndex: 'insurance_time',
      key: 'insurance_time',
    },
  ];

  const columns_tranfer: any = [
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
        if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
        return (
          <a href={item?.file} download target="_blank" rel="noreferrer">
            <EyeFilled />
          </a>
        );
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

  const columns_liquidation: any = [
    {
      title: 'Mã thanh lý',
      dataIndex: 'code',
      key: 'code',
      show: true,
      widthExcel: 35,
    },
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
    {
      title: 'Tài liệu thanh lý',
      key: 'file',
      show: true,
      widthExcel: 25,
      render: (item: any) => {
        if (!item?.file) return <div>Không có tài liệu đính kèm</div>;
        return (
          <a href={item?.file} download target="_blank" rel="noreferrer">
            <EyeFilled />
          </a>
        );
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Tooltip title="Chi tiết phiếu thanh lý">
          <Link
            to={`/equipment/liquidation/detail/${id}/${item.id}?edit=${false}`}
          >
            <FileWordFilled />
          </Link>
        </Tooltip>
      ),
    },
  ];

  const columns_inventory: any = [
    {
      title: 'Đơn vị kiểm định',
      dataIndex: 'inventory_unit',
      key: 'inventory_unit',
    },
    {
      title: 'Nội dung kiểm định',
      dataIndex: 'inventory_note',
      key: 'inventory_note',
    },
    {
      title: 'Thời gian kiểm định',
      dataIndex: 'inventory_time',
      key: 'inventory_time',
    },
  ];

  const getDetailEquipment = (id: any) => {
    setLoading(true);
    equipmentApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipment(data.equipment);
          setSupplies(data?.equipment?.Equipment_Supplies);
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

  const getHandoverInfo = (id: any) => {
    equipmentHandoverApi
      .getHandoverInfo(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setHandoverInfo(data.handover_info);
        }
      })
      .catch();
  };

  const getHistoryInspection = (id: any) => {
    equipmentInspectionApi
      .getHistoryInspection(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setInspection(data.inspection);
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

  const downloadHandoverInfo = (item: any) => {
    let equipment = {
      name: item?.Equipment?.name,
      model: item?.Equipment?.model,
      serial: item?.Equipment?.serial,
      user_id: item?.handover_in_charge?.name,
      department: item?.Department?.name,
      department_id: item?.Department?.id,
      handover_date:
        item?.handover_date && moment(item?.handover_date).format('DD-MM-YYYY'),
      handover_person_id: item?.handover_create?.name,
    };
    downloadHandoverDocx(equipment);
  };

  useEffect(() => {
    getDetailEquipment(id);
    getHistoryRepair(id);
    getHandoverInfo(id);
    getHistoryInspection(id);
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
      key_1: 'Hãng sản xuất',
      value_1: `${
        equipment?.manufacturer_id ? equipment?.manufacturer_id : ''
      }`,
      key_2: 'Nước sản xuất',
      value_2: `${
        equipment?.manufacturing_country_id
          ? equipment?.manufacturing_country_id
          : ''
      }`,
    },
    {
      key_1: 'Nhà cung cấp',
      value_1: `${equipment?.Provider?.name ? equipment.Provider.name : ''}`,
      key_2: 'Dự án',
      value_2: `${equipment?.Project?.name ? equipment.Project.name : ''}`,
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
      value_1: `${equipment?.unit ? equipment?.unit : ''}`,
      // key_1: 'Đơn vị tính',
      // value_1: `${
      //   equipment?.Equipment_Unit?.name ? equipment?.Equipment_Unit?.name : ''
      // }`,
      // key_2: 'Mức độ rủi ro',
      // value_2: `${
      //   equipment?.Equipment_Risk_Level?.name
      //     ? equipment?.Equipment_Risk_Level?.name
      //     : ''
      // }`,
      key_2: '',
      value_2: ``,
    },
    {
      key_1: 'Mã hóa TB',
      value_1: `${equipment?.hash_code ? equipment?.hash_code : ''}`,
      key_2: 'Loại thiết bị',
      value_2: `${
        equipment?.Equipment_Type?.name ? equipment?.Equipment_Type?.name : ''
      }`,
    },
    {
      key_1: 'Số lượng',
      value_1: `${equipment?.quantity ? equipment?.quantity : ''}`,
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
    // {
    //   key_1: 'Hãng sản xuất',
    //   value_1: `${equipment?.manufacturer_id}`,
    //   key_2: 'Quốc gia',
    //   value_2: `${equipment?.manufacturing_country_id}`,
    // },
    // {
    //   key_1: 'Thời điểm kết thúc HĐ LDLK',
    //   value_1: '20/11/2019',
    //   key_2: 'Ngày hết hạn bảo hành',
    //   value_2: '25/12/2019',
    // },
    // {
    //   key_1: 'Bảo dưỡng định kỳ',
    //   value_1: '12 tháng',
    //   key_2: 'Ngày bảo dưỡng gần nhất',
    //   value_2: '20/11/2019',
    // },
    // {
    //   key_1: 'Kiểm định định kỳ',
    //   value_1: '12 tháng',
    //   key_2: 'Ngày kiểm định gần nhất',
    //   value_2: '25/12/2019',
    // },
    {
      key_1: 'Bảo dưỡng định kỳ',
      value_1: `${
        equipment?.regular_maintenance
          ? equipment?.regular_maintenance + ' tháng'
          : ''
      }`,
      key_2: 'Kiểm định định kỳ',
      value_2: `${
        equipment?.regular_inspection
          ? equipment?.regular_inspection + ' tháng'
          : ''
      }`,
    },
    // {
    //   key_1: 'Kiểm xạ định kỳ',
    //   value_1: '12 tháng',
    //   key_2: 'Ngày kiểm xạ gần nhất',
    //   value_2: '20/11/2019',
    // },
    // {
    //   key_1: 'Ngoại kiểm định kỳ',
    //   value_1: '12 tháng',
    //   key_2: 'Ngoại kiểm lần cuối',
    //   value_2: '20/11/2019',
    // },
    {
      key_1: 'Thông số kĩ thuật',
      value_1: `${
        equipment?.technical_parameter ? equipment.technical_parameter : ''
      }`,
      key_2: 'Cấu hình kĩ thuật',
      value_2: `${equipment?.configuration ? equipment.configuration : ''}`,
    },
    {
      key_1: 'Quy trình sử dụng',
      value_1: `${equipment?.usage_procedure ? equipment.usage_procedure : ''}`,
      key_2: 'Ghi chú',
      value_2: `${equipment?.note ? equipment.note : ''}`,
    },
    {
      key_1: 'Ngày nhập kho',
      value_1: `${
        equipment.warehouse_import_date !== null
          ? moment(equipment.warehouse_import_date).format(
              'HH:mm:ss DD/MM/YYYY'
            )
          : ''
      }`,
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

  const data_insurance: any[] = [];

  // const data_tranfer: any[] = [];

  const data_inventory: any[] = [];

  const onDownload = () => {
    fetch(equipment?.image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ THIẾT BỊ</div>
        <div className="flex flex-row gap-6">
          <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button>
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
              <div className="text-center leading-9">Mã QR code thiết bị</div>
              <img
                src={equipment?.qrcode || qrcode}
                width={200}
                className="rounded-lg w-52 h-52 "
                alt="Mã QR code thiết bị"
              />
            </div>
          </div>
          <Divider />
          <div>
            <div className="text-center font-bold text-2xl mb-9">
              Danh sách vật tư đi kèm
            </div>
            <Table
              columns={columns_supply}
              dataSource={supplies}
              pagination={false}
              className="shadow-md"
            />
          </div>
          <Divider />
          <div>
            <div className="text-center font-bold text-2xl mb-9">
              Thống kê lịch sử hoạt động của thiết bị
            </div>
            <div className="mb-10">
              <div className="font-bold text-xl mb-6">Thông tin bàn giao</div>
              <Table
                columns={columns_handover}
                dataSource={handoverInfo}
                pagination={false}
                className="shadow-md"
              />
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
              <div className="font-bold text-xl mb-6">Lịch sử bảo hành</div>
              <Table
                columns={columns_insurance}
                dataSource={data_insurance}
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
              <div className="font-bold text-xl mb-6">Lịch sử kiểm định</div>
              <Table
                columns={columns_inspection}
                dataSource={inspection}
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
