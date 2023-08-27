import { useState, useEffect } from 'react';
import { FilePdfFilled, FileWordFilled } from '@ant-design/icons';
import { Button, Divider, Image, Table, Tooltip } from 'antd';
import { useParams } from 'react-router-dom';
import image from 'assets/image.png';
import qrcode from 'assets/qrcode.png';
import type { ColumnsType } from 'antd/es/table';
import equipmentApi from 'api/equipment.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import moment from 'moment';
import equipmentHandoverApi from 'api/equipment_handover.api';
import { downloadHandoverDocx } from 'utils/file.util';
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const Detail = () => {

  const params = useParams();
  const { id } = params;
  const [equipment, setEquipment] = useState<any>({});
  const [repairInfo, setRepairInfo] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [handoverInfo, setHandoverInfo] = useState([]);
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
    }
  ];
  
  const columns_supply: any = [
    {
      title: 'Tên vật tư',
      key: 'name',
      render: (item: any) => (
        <>{item?.Supply?.name}</>
      )
    },
    {
      title: 'Code',
      key: 'code',
      render: (item: any) => (
        <>{item?.Supply?.code}</>
      )
    },
    {
      title: 'Năm sản xuất',
      key: 'year_of_manufacture',
      render: (item: any) => (
        <>{item?.Supply?.year_of_manufacture}</>
      )
    },
    {
      title: 'Năm sử dụng',
      key: 'year_in_use',
      render: (item: any) => (
        <>{item?.Supply?.year_in_use}</>
      )
    },
    {
      title: 'Số lượng vật tư đi kèm thiết bị',
      key: 'count',
      render: (item: any) => (
        <>{item?.count}</>
      )
    },
  ]
  
  const columns_handover: any = [
    {
      title: 'Tên thiết bị',
      key: 'name',
      render: (item: any) => (
        <>{item?.Equipment?.name}</>
      )
    },
    {
      title: 'Ngày bàn giao',
      key: 'handover_date',
      render: (item: any) => (
        <>{item?.handover_date && moment(item?.handover_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Cán bộ phụ trách',
      key: 'handover_in_charge',
      render: (item: any) => (
        <>{item?.handover_in_charge?.name}</>
      )
    },
    {
      title: 'Cán bộ lập biên bản',
      key: 'handover_create',
      render: (item: any) => (
        <>{item?.handover_create?.name}</>
      )
    },
    {
      title: 'Khoa Phòng nhận bàn giao',
      key: 'department',
      render: (item: any) => (
        <>{item?.Department?.name}</>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (item: any) => (
        <Tooltip title="Biên bản bàn giao">
          <FileWordFilled onClick={() => downloadHandoverInfo(item)}/>
        </Tooltip>
        
      )
    }
  ]
  
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
        <>{item?.broken_report_date && moment(item?.broken_report_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày lập kế hoạch sửa chữa',
      key: 'schedule_repair_date',
      render: (item: any) => (
        <>{item?.schedule_repair_date && moment(item?.schedule_repair_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày sửa chữa',
      key: 'repair_date',
      render: (item: any) => (
        <>{item?.repair_date && moment(item?.repair_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày hoàn thành sửa chữa',
      key: 'repair_completion_date',
      render: (item: any) => (
        <>{item?.repair_completion_date && moment(item?.repair_completion_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Chi phí dự kiến',
      dataIndex: 'estimated_repair_cost',
      key: 'estimated_repair_cost',
    },
    {
      title: 'Chi phí thực tế',
      dataIndex: 'actual_repair_cost',
      key: 'actual_repair_cost',
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider_id',
      render: (item: any) => (
        <>{item?.Provider?.name}</>
      )
    },
    {
      title: 'Tình trạng thiết bị',
      key: 'repair_status',
      render: (item: any) => (
        <>{item?.Repair_Status?.name}</>
      )
    }
  ]
  
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
      title: 'Biên bản điều chuyển',
      dataIndex: 'tranfer_report',
      key: 'tranfer_report',
    },
    {
      title: 'Khoa phòng điều chuyển',
      dataIndex: 'tranfer_room',
      key: 'tranfer_room',
    },
    {
      title: 'Số lượng',
      dataIndex: 'tranfer_count',
      key: 'tranfer_count',
    },
    {
      title: 'Thời gian',
      dataIndex: 'tranfer_time',
      key: 'tranfer_time',
    },
    {
      title: 'Người lập phiếu',
      dataIndex: 'tranfer_author',
      key: 'tranfer_author',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'tranfer_status',
      key: 'tranfer_status',
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
  ]

  const getDetailEquipment = (id: any) => {
    equipmentApi.detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipment(data.equipment);
          setSupplies(data?.equipment?.Equipment_Supplies);
        }
      })
      .catch()
  }

  const getHistoryRepair = (id: any) => {
    equipmentRepairApi.getHistoryRepair(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setRepairInfo(data.repair_info);
        }
      })
      .catch()
  }

  const getHandoverInfo = (id: any) => {
    equipmentHandoverApi.getHandoverInfo(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setHandoverInfo(data.handover_info);
        }
      })
      .catch()
  }

  const downloadHandoverInfo = (item: any) => {
    let equipment = {
      name: item?.Equipment?.name,
      model: item?.Equipment?.model,
      serial: item?.Equipment?.serial,
      user_id: item?.handover_in_charge?.name,
      department: item?.Department?.name,
      department_id: item?.Department?.id,
      handover_date: item?.handover_date && moment(item?.handover_date).format("DD-MM-YYYY"),
      handover_person_id: item?.handover_create?.name
    }
    downloadHandoverDocx(equipment);
  }

  useEffect(() => {
    getDetailEquipment(id);
    getHistoryRepair(id);
    getHandoverInfo(id);
  }, [id]);

  const data: DataType[] = [
    {
      key_1: 'Khoa - Phòng',
      value_1: `${equipment?.Department?.name}`,
      key_2: 'Trạng thái',
      value_2: `${equipment?.Equipment_Status?.name}`,
    },
    {
      key_1: 'Model',
      value_1: `${equipment?.model}`,
      key_2: 'Serial',
      value_2: `${equipment?.serial}`,
    },
    {
      key_1: 'Ngày nhập kho',
      value_1: `${equipment?.warehouse_import_date ? new Date(equipment?.warehouse_import_date).toLocaleDateString() : ''}`,
      key_2: 'Loại thiết bị',
      value_2: `${equipment?.Equipment_Type?.name}`,
    },
    {
      key_1: 'Giá nhập',
      value_1: `${equipment?.import_price}` || '',
      key_2: 'Số lượng',
      value_2: '1',
    },
    {
      key_1: 'Năm sản xuất',
      value_1: `${equipment?.year_of_manufacture}`,
      key_2: 'Năm sử dụng',
      value_2: `${equipment?.year_in_use}`,
    },
    {
      key_1: 'Hãng sản xuất',
      value_1: `${equipment?.manufacturer_id}`,
      key_2: 'Quốc gia',
      value_2: `${equipment?.manufacturing_country_id}`,
    },
    {
      key_1: 'Thời điểm kết thúc HĐ LDLK',
      value_1: '20/11/2019',
      key_2: 'Ngày hết hạn bảo hành',
      value_2: '25/12/2019',
    },
    {
      key_1: 'Bảo dưỡng định kỳ',
      value_1: '12 tháng',
      key_2: 'Ngày bảo dưỡng gần nhất',
      value_2: '20/11/2019',
    },
    {
      key_1: 'Kiểm định định kỳ',
      value_1: '12 tháng',
      key_2: 'Ngày kiểm định gần nhất',
      value_2: '25/12/2019',
    },
    {
      key_1: 'Kiểm xạ định kỳ',
      value_1: '12 tháng',
      key_2: 'Ngày kiểm xạ gần nhất',
      value_2: '20/11/2019',
    },
    {
      key_1: 'Ngoại kiểm định kỳ',
      value_1: '12 tháng',
      key_2: 'Ngoại kiểm lần cuối',
      value_2: '20/11/2019',

    },
    {
      key_1: 'Kiểm định môi trường phòng định kỳ',
      value_1: '12 tháng',
      key_2: 'Kiểm định môi trường phòng lần cuối',
      value_2: '20/11/2019',
    }
  ]

  const data_insurance: any[] = [

  ]

  const data_tranfer: any[] = [

  ]

  const data_inventory: any[] = [

  ]

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ THIẾT BỊ</div>
        <Button
          type='primary'
          className="flex flex-row items-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
        >
          <FilePdfFilled />
          <div
            className="font-medium text-md text-[#5B69E6]"

          >Xuất PDF</div>
        </Button>
      </div>
      <Divider />
      <div id='detail' className=''>
        <div className='flex flex-row gap-6 my-8'>
          <div className='flex flex-col gap-4 items-center basis-1/3'>
            <Image
              src={equipment?.image || image}
              width={300}
            />
            <div>Ảnh thiết bị</div>
            <Image
              src={equipment?.qrcode || qrcode}
              width={200}
            />
            <div>Mã QR code thiết bị</div>
          </div>
          <div className='basis-2/3'>
            <div className='font-bold text-2xl'>{equipment?.name}</div>
            <div className='mt-4'>
              <Table columns={columns} dataSource={data} pagination={false} className="shadow-md" />
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <div className='text-center font-bold text-2xl mb-9'>Danh sách vật tư đi kèm</div>
          <Table columns={columns_supply} dataSource={supplies} pagination={false} className="shadow-md" />
        </div>
        <Divider />
        <div>
          <div className='text-center font-bold text-2xl mb-9'>Thống kê lịch sử hoạt động của thiết bị</div>
          <div className='mb-10'>
            <div className='font-bold text-xl mb-6'>Thông tin bàn giao</div>
            <Table columns={columns_handover} dataSource={handoverInfo} pagination={false} className="shadow-md" />
          </div>
          <div className='mb-10'>
            <div className='font-bold text-xl mb-6'>Lịch sử sửa chữa</div>
            <Table columns={columns_repair} dataSource={repairInfo} pagination={false} className="shadow-md" />
          </div>
          <div className='mb-10'>
            <div className='font-bold text-xl mb-6'>Lịch sử bảo hành</div>
            <Table columns={columns_insurance} dataSource={data_insurance} pagination={false} className="shadow-md" />
          </div>
          <div className='mb-10'>
            <div className='font-bold text-xl mb-6'>Lịch sử điều chuyển</div>
            <Table columns={columns_tranfer} dataSource={data_tranfer} pagination={false} className="shadow-md" />
          </div>
          <div className='mb-10'>
            <div className='font-bold text-xl mb-6'>Lịch sử kiểm định</div>
            <Table columns={columns_inventory} dataSource={data_inventory} pagination={false} className="shadow-md" />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Detail