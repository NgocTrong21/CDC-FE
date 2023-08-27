import { InfoCircleFilled } from '@ant-design/icons'
import { Button, Checkbox, Divider, Modal, Table } from 'antd'
import roleApi from 'api/role.api';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const EmailConfig = () => {

  const [showEmailConfigModal, setShowEmailConfigModal] = useState<boolean>(false);
  const [rolesHandover, setRolesHandover] = useState([]);
  const [rolesTransfer, setRolesTransfer] = useState([]);
  const [rolesReport, setRolesReport] = useState([]);
  const [rolesReHandover, setRolesReHandover] = useState([]);
  const [rolesRequestLiquidation, setRolesRequestLiquidation] = useState([]);
  const [rolesApproveLiquidation, setRolesApproveLiquidation] = useState([]);
  const columns: any = [
    {
      title: 'Vai trò',
      render: (item: any) => (
        <>{item?.Role?.name}</>
      )
    },
    {
      title: 'Trạng thái',
      render: (item: any) => (
        <Checkbox
          checked={item.check === 1 ? true : false}
          onChange={(e: any) => handleChangeRole(e, item)}
        />
      )
    }
  ]

  const getListRoleEmail = () => {
    roleApi.listRoleEmailConfig()
      .then((res: any) => {
        const { data } = res.data;

        let rolesHandover: any = [];
        let rolesTransfer: any = [];
        let rolesReport: any = [];
        let rolesReHandover: any = [];
        let rolesRequestLiquidation: any = [];
        let rolesApproveLiquidation: any = [];

        data.roles.forEach((role: any) => {
          if (role.action_id === 1) {
            rolesHandover.push(role)
          }
          if (role.action_id === 2) {
            rolesTransfer.push(role)
          }
          if (role.action_id === 3) {
            rolesReport.push(role)
          }
          if (role.action_id === 10) {
            rolesReHandover.push(role)
          }
          if (role.action_id === 9) {
            rolesRequestLiquidation.push(role)
          }
          if (role.action_id === 5) {
            rolesApproveLiquidation.push(role)
          }

        })

        setRolesHandover(rolesHandover);
        setRolesTransfer(rolesTransfer);
        setRolesReport(rolesReport);
        setRolesReHandover(rolesReHandover);
        setRolesRequestLiquidation(rolesRequestLiquidation);
        setRolesApproveLiquidation(rolesApproveLiquidation);
      })
      .catch()
  }

  useEffect(() => {
    getListRoleEmail();
  }, [])

  const handleChangeRole = (e: any, item: any) => {
    let dataRolesHandover: any = rolesHandover.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setRolesHandover(dataRolesHandover);

    let dataRolesTransfer: any = rolesTransfer.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setRolesTransfer(dataRolesTransfer);

    let dataRolesReHandover: any = rolesReHandover.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setRolesReHandover(dataRolesReHandover);

    let dataRolesReport: any = rolesReport.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setRolesReport(dataRolesReport);

    let dataRolesRequestLiquidation: any = rolesRequestLiquidation.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setRolesRequestLiquidation(dataRolesRequestLiquidation);

    let dataRolesApproveLiquidation: any = rolesApproveLiquidation.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setRolesApproveLiquidation(dataRolesApproveLiquidation);
  }

  const handleSubmitConfig = () => {
    try {
      const data = [...rolesHandover, ...rolesTransfer, ...rolesReport,
      ...rolesReHandover, ...rolesRequestLiquidation, ...rolesApproveLiquidation]
        .map((role: any) => ({
          role_id: role.role_id,
          check: role.check,
          action_id: role.action_id
        }))
      roleApi.configRoleEmail(data)
        .then((res: any) => {
          const { success } = res.data;
          if (success) {
            toast.success('Cập nhật thành công!');
          } else {
            toast.error('Cập nhật thất bại!');
          }
        })
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div>
      <div className="title">CẤU HÌNH EMAIL</div>
      <Divider />
      <div
        className='text-red-600 flex items-center cursor-pointer text-lg gap-2 mb-6'
        onClick={() => setShowEmailConfigModal(true)}
      >
        <InfoCircleFilled />
        <div>Chi tiết cấu hình</div>
      </div>
      <div className='grid grid-cols-2 gap-20 mb-20'>
        <div>
          <div className='font-medium text-base'>Tác vụ bàn giao thiết bị</div>
          <Table
            columns={columns}
            dataSource={rolesHandover}
            className="mt-6 shadow-md"
            pagination={false}
          />
        </div>
        <div>
          <div className='font-medium text-base'>Tác vụ điều chuyển thiết bị</div>
          <Table
            columns={columns}
            dataSource={rolesTransfer}
            className="mt-6 shadow-md"
            pagination={false}
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-20 mb-20'>
        <div>
          <div className='font-medium text-base'>Tác vụ báo hỏng thiết bị</div>
          <Table
            columns={columns}
            dataSource={rolesReport}
            className="mt-6 shadow-md"
            pagination={false}
          />
        </div>
        <div>
          <div className='font-medium text-base'>Tác vụ bàn giao lại thiết bị (sau khi hoàn tất sửa chữa)</div>
          <Table
            columns={columns}
            dataSource={rolesReHandover}
            className="mt-6 shadow-md"
            pagination={false}
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-20 mb-10'>
        <div>
          <div className='font-medium text-base'>Tác vụ yêu cầu thanh lý thiết bị</div>
          <Table
            columns={columns}
            dataSource={rolesRequestLiquidation}
            className="mt-6 shadow-md"
            pagination={false}
          />
        </div>
        <div>
          <div className='font-medium text-base'>Tác vụ phê duyệt thanh lý thiết bị</div>
          <Table
            columns={columns}
            dataSource={rolesApproveLiquidation}
            className="mt-6 shadow-md"
            pagination={false}
          />
        </div>
      </div>
      <div className='flex justify-center'>
        <Button className='button mt-8' onClick={handleSubmitConfig}>Cập nhật</Button>
      </div>
      <Modal
        title='Cấu hình gửi tác vụ gửi mail'
        open={showEmailConfigModal}
        onCancel={() => setShowEmailConfigModal(false)}
        footer={null}
      >
        <div className='text-lg'>
          - Bạn vui lòng tích vào check box những đối tượng người dùng mà bạn muốn gửi mail
        </div>
        <div className='text-lg'>
          - Đối với mỗi tác vụ như bàn giao, điều chuyển, ... hệ thống sẽ gửi mail thông báo tới những đối tượng người dùng trong danh sách mà bạn đã cấu hình
        </div>
      </Modal>
    </div>
  )
}

export default EmailConfig