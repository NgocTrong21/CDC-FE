import { SelectOutlined, ToolFilled } from '@ant-design/icons';
import { Checkbox, Divider, Table, Tooltip } from 'antd'
import equipmentRepairApi from 'api/equipment_repair.api';
import ExportToExcel from 'components/Excel';
import { CURRENT_USER } from 'constants/auth.constant';
import moment from 'moment';
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getDataExcel, getFields } from 'utils/globalFunc.util';

const HistoryRepair = () => {
  const current_user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '')
  const checkRoleApproveRepair = (): boolean => {
    return current_user?.Role?.Role_Permissions?.find((item: any) => item?.Permission?.name === "repair_equipment.approve")
  }

  const param: any = useParams();
  const { id } = param;
  const [equipment, setEquipment] = useState<any>({});
  const [repairInfo, setRepairInfo] = useState([]);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const columns: any = [
    {
      title: 'Mã sửa chữa',
      dataIndex: 'code',
      key: 'code',
      show: true,
      widthExcel: 35,
    },
    {
      title: 'Ngày báo hỏng',
      key: 'broken_report_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.broken_report_date && moment(item?.broken_report_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày lập kế hoạch sửa chữa',
      key: 'schedule_repair_date',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <>{item?.schedule_repair_date && moment(item?.schedule_repair_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày sửa chữa',
      key: 'repair_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.repair_date && moment(item?.repair_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày hoàn thành sửa chữa',
      key: 'repair_completion_date',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <>{item?.repair_completion_date && moment(item?.repair_completion_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Chi phí dự kiến',
      dataIndex: 'estimated_repair_cost',
      key: 'estimated_repair_cost',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Chi phí thực tế',
      dataIndex: 'actual_repair_cost',
      key: 'actual_repair_cost',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider_id',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <>{item?.Provider?.name}</>
      )
    },
    {
      title: 'Tình trạng thiết bị',
      key: 'repair_status',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <>{item?.Repair_Status?.name}</>
      )
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: checkRoleApproveRepair(),
      render: (item: any) => (
        <Tooltip title='Cập nhật trạng thái sửa chữa'>
          <Link to={`/equipment/repair/update_schedule/${id}/${item.id}`}><ToolFilled /></Link>
        </Tooltip>
      )
    }
  ]
  const [columnTable, setColumnTable] = useState<any>(columns);

  const onChangeCheckbox = (item: any, e: any) => {
    let newColumns: any = columnTable.map((column: any) => {
      if (item.title === column.title) {
        column.show = e.target.checked;
      };
      return column;
    });
    setColumnTable(newColumns);
  }

  const getHistoryRepair = (id: number) => {
    equipmentRepairApi.getHistoryRepair(id)
      .then((res: any) => {
        const { success, data } = res?.data;       
        if (success) {
          setEquipment(data.equipment);
          setRepairInfo(data.repair_info.filter((item: any) => item?.schedule_create_user_id));
        }
      })
      .catch()
  }

  useEffect(() => {
    getHistoryRepair(id);
  }, [id])

  const downloadHistoryRepair = () => {
    let fields = getFields(columnTable);
    let data = repairInfo
      .map((x: any) => ({
        code: x?.code,
        broken_report_date: x?.broken_report_date && moment(x?.broken_report_date).format("DD-MM-YYYY"),
        schedule_repair_date: x?.schedule_repair_date && moment(x?.schedule_repair_date).format("DD-MM-YYYY"),
        repair_date: x?.repair_date && moment(x?.repair_date).format("DD-MM-YYYY"),
        repair_completion_date: x?.repair_completion_date && moment(x?.repair_completion_date).format("DD-MM-YYYY"),
        estimated_repair_cost: x?.estimated_repair_cost,
        actual_repair_cost: x?.actual_repair_cost,
        provider_id: x?.Provider?.name,
        repair_status: x?.Repair_Status?.name
      }))
    let objectKey = Object.keys(data[0]);
    let newData: any = getDataExcel(data, objectKey, fields);
    const workSheetColumnName = fields?.map((item: any) => ({title: item?.title, width: item?.width}));
    const workSheetName = 'Lịch sử sửa chữa';
    const headerName = `Lịch sử sửa chữa - ${equipment?.name} - ${equipment?.Department?.name}`
    const fileName = `${headerName} - ${new Date().toISOString().substring(0, 10)}.xlsx`;
    const finalData: any = [workSheetColumnName, ...newData];

    return {
      data: finalData,
      sheetName: workSheetName,
      fileName,
      headerName
    }
  }

  return (
    <div>
      <div className="title text-center">LỊCH SỬ SỬA CHỮA THIẾT BỊ</div>
      <Divider />
      <div>
        <div className='mb-4 title'>Thông tin thiết bị</div>
        <div className='flex flex-row gap-20'>
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
      <div className='flex flex-row justify-between'>
        <div className="flex justify-between flex-col">
          <div
            className='flex flex-row gap-4 items-center mb-4'
            onClick={() => setIsShowCustomTable(!isShowCustomTable)}
          >
            <SelectOutlined />
            <div className='font-medium text-center cursor-pointer text-base'>Tùy chọn trường hiển thị</div>
          </div>
          {
            isShowCustomTable &&
            <div className='flex flex-row gap-4'>
              {
                columnTable.length > 0 && columnTable.map((item: any) => (
                  <div>
                    <Checkbox
                      defaultChecked={item?.show}
                      onChange={(e: any) => onChangeCheckbox(item, e)}
                    />
                    <div>{item?.title}</div>
                  </div>
                ))
              }
            </div>
          }
        </div>
        <ExportToExcel getData={downloadHistoryRepair}/>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={repairInfo}
        className="mt-6 shadow-md"
      />
    </div>
  )
}

export default HistoryRepair