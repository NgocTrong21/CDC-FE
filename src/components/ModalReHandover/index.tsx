import { Button, Form, Input, Modal, Select } from 'antd'
import equipmentRepairApi from 'api/equipment_repair.api';
import { repaired_status } from 'constants/dataFake.constant';
import { NotificationContext } from 'contexts/notification.context';
import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { convertBase64, getCurrentUser } from 'utils/globalFunc.util';

const ModalReHandover = (props: any) => {
  const {
    equipment,
    showReHandoverModal,
    setShowReHandoverModal,
    callback
  } = props;
  
  const [form] = Form.useForm();
  const [brokenFile, setBrokenFile] = useState<any>();
  const [repairFile, setRepairFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const currentUser = getCurrentUser();
  
  const readUploadFile = async (key: any, e: any) => {
    let file = e.target.files[0];
    if (file) {
      let fileBase64 = await convertBase64(file);
      if(key === 'broken') {
        setBrokenFile(fileBase64);
      }
      if(key === 'repair') {
        setRepairFile(fileBase64);
      }
    }
  }

  const reHandover = (values: any) => {
    const data = {
      ...values,
      id: equipment?.repair_id,
      equipment_id: equipment?.id,
      equipment_name: equipment?.name,
      department_id: equipment?.department_id,
      department_name: equipment?.department_name,
      brokenFile,
      repairFile,
      user_id: currentUser.id
    }
    
    setLoading(true);
    equipmentRepairApi.reHandover(data)
      .then((res: any) => {
        const { success } = res.data;
        if(success) {
          toast.success("Bàn giao thành công!");
          setShowReHandoverModal();
          callback();
          increaseCount();
          getAllNotifications();
        } else {
          toast.error("Bàn giao thất bại!");
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }
  
  useEffect(() => {
    if(equipment && equipment.repair_status) {
      if(equipment.repair_status === 3) {
        form.setFieldsValue({
          status_id: 3
        })
      }else {
        form.setFieldsValue({
          status_id: 6
        })
      }
    }    
  }, [equipment])

  return (
    <Modal
      title="Bàn giao lại thiết bị"
      open={showReHandoverModal}
      onCancel={setShowReHandoverModal}
      footer={null}
    >
      <Form form={form}  layout="vertical" size="large" onFinish={reHandover}>
        <Form.Item 
          name="status_id" 
          label="Trạng thái thiết bị"
          required
          rules={[{ required: true, message: 'Hãy chọn trạng thái thiết bị!' }]}
        >
          <Select 
            showSearch
            placeholder='Chọn trạng thái'
            allowClear
            options={repaired_status}
            disabled
          />
        </Form.Item>
        <Form.Item
          className="fileUploadInput"
          label="Đính kèm phiếu báo hỏng (Không bắt buộc)"
        >
          <Input
            type="file"
            placeholder='Chọn file word'
            onChange={(e: any) => readUploadFile("broken", e)}
          />
        </Form.Item>
        <Form.Item
          className="fileUploadInput"
          label="Đính kèm phiếu yêu cầu sửa chữa (Không bắt buộc)"
        >
          <Input
            type="file"
            placeholder='Chọn file word'
            onChange={(e: any) => readUploadFile("repair", e)}
          />
        </Form.Item>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button htmlType='submit' loading={loading} className='button-primary'>Xác nhận</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={setShowReHandoverModal} className='button-primary'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalReHandover