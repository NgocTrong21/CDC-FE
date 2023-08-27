import { Button, Form, Input, Modal, Select } from 'antd'
import equipmentRepairApi from 'api/equipment_repair.api';
import { repaired_status } from 'constants/dataFake.constant';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';

const ModalReHandover = (props: any) => {
  const {
    equipment,
    showReHandoverModal,
    setShowReHandoverModal,
    reHandover,
    loadingReHandover
  } = props;
  
  const [form] = Form.useForm();
  const [brokenFile, setBrokenFile] = useState<any>();
  const [repairFile, setRepairFile] = useState<any>();
  
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

  // const reHandover = (values: any) => {
  //   const data = {
  //     ...values,
  //     equipment_id: equipment?.id,
  //     equipment_name: equipment?.name,
  //     department_id: equipment?.department_id,
  //     department_name: equipment?.department_name,
  //     brokenFile,
  //     repairFile
  //   }
  //   setLoading(true);
  //   equipmentRepairApi.reHandover(data)
  //     .then((res: any) => {
  //       const { success } = res.data;
  //       if(success) {
  //         toast.success("Bàn giao thành công!");
  //         setShowReHandoverModal();
  //       } else {
  //         toast.error("Bàn giao thất bại!");
  //       }
  //     })
  //     .catch()
  //     .finally(() => setLoading(false))
  // }

  
  
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
      <Form form={form}  layout="vertical" size="large" onFinish={(data) => {reHandover(data, equipment, brokenFile, repairFile)}}>
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
        <div className='mb-6'>Gửi email xác nhận cho đại diện khoa phòng</div>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button htmlType='submit' loading={loadingReHandover} className='button'>Xác nhận</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={setShowReHandoverModal} className='button'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalReHandover