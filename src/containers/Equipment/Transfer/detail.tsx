import { FileWordFilled } from '@ant-design/icons';
import { Divider, Menu, Table, Tooltip } from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import { transfer_status } from 'constants/dataFake.constant';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { downloadTransferDocx } from 'utils/file.util';

const TransferDetail = () => {
  const param: any = useParams();
  const { id } = param;
  const [equipment, setEquipment] = useState<any>({});
  const [transferData, setTransferData] = useState<any>([])
  const columns: any = [
    {
      title: 'Người tạo phiếu',
      key: 'create_user_id',
      show: true,
      widthExcel: 35,
      render: (item: any) => (
        <>{item?.transfer_create_user?.name}</>
      )
    },
    {
      title: 'Ngày tạo phiếu',
      key: 'transfer_date',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>{item?.transfer_date && moment(item?.transfer_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Khoa - Phòng hiện tại',
      key: 'from_department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.from_department?.name}</>
        )
      }
    },
    {
      title: 'Khoa - Phòng điều chuyển',
      key: 'to_department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.to_department?.name}</>
        )
      }
    },
    {
      title: 'Tình trạng xử lý',
      key: 'transfer_status',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{handleTransferStatus(item?.transfer_status)}</>
      )
    },
    {
      title: 'Người phê duyệt',
      key: 'approver_id',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>{item?.transfer_approver?.name}</>
      )
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className='flex flex-row'>
          {
            item?.transfer_status === 1 &&
            <Menu.Item key="word">
              <Tooltip title='Biên bản điều chuyển'>
                <FileWordFilled onClick={() => handleDownloadTransferData(item)} />
              </Tooltip>
            </Menu.Item>
          }
        </Menu>
      )
    }
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  console.log("Check table", transferData, equipment)
  const getTransferDetail = (id: number) => {
    equipmentTransferApi.detail(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setEquipment(data?.equipment[0]);
          setTransferData(data?.equipment);
        }
      })
      .catch()
  }

  useEffect(() => {
    getTransferDetail(id);
  }, [id])

  const handleTransferStatus = (status: any) => {
    return transfer_status.filter((item: any) => item.value === status)[0]?.label;
  }

  const handleDownloadTransferData = (item: any) => {
    let data = {
      name: item?.Equipment?.name,
      model: item?.Equipment?.model,
      serial: item?.Equipment?.serial,
      from_department: item?.from_department?.name,
      to_department: item?.to_department?.name,
      transfer_date: moment(item?.transfer_date).format("DD-MM-YYYY"),
      transfer_create_user: item?.transfer_create_user?.name,
      transfer_approver: item?.transfer_approver?.name,
      note: item?.note
    }
    downloadTransferDocx(data);
  }

  return (
    <div>
      <div className="title text-center">DANH SÁCH PHIẾU YÊU CẦU ĐIỀU CHUYỂN THIẾT BỊ</div>
      <Divider />
      <div>
        <div className='title'>THÔNG TIN THIẾT BỊ</div>
        <div>Tên: {equipment?.Equipment?.name}</div>
        <div>Model: {equipment?.Equipment?.model}</div>
        <div>Serial: {equipment?.Equipment?.serial}</div>
      </div>
      <Divider />
      <div className='flex flex-row justify-between'>
        <div className='title'>CHI TIẾT PHIẾU YÊU CẦU ĐIỀU CHUYỂN</div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={transferData}
        className="mt-6 shadow-md"
        pagination={false}
      />
    </div>
  )
}

export default TransferDetail