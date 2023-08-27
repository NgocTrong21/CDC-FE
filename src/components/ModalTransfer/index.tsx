import { Button, Form, Input, Modal, Select } from 'antd'
import equipmentTransferApi from 'api/equipment_transfer.api'
import { FilterContext } from 'contexts/filter.context'
import moment from 'moment'
import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { options } from 'utils/globalFunc.util'

const ModalTransfer = (props: any) => {

  const {
    showTransferModal,
    setShowTransferModal,
    callback,
    dataTransfer
  } = props;

  const { TextArea } = Input;
  const { departments } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(Object.keys(dataTransfer).length === 0) return;
    form.setFieldsValue({
      equipment_name: dataTransfer.equipment_name,
      equipment_id: dataTransfer.equipment_id,
      from_department_name: dataTransfer.from_department_name,
      from_department_id: dataTransfer?.from_department_id,
      create_user_id: dataTransfer?.create_user_id,
      transfer_date: moment(new Date()).format("DD-MM-YYYY"),
      transfer_create_user: dataTransfer?.transfer_create_user
    })
  }, [dataTransfer])

  const transferEquipment = (values: any) => {
    const data = {
      ...values,
      transfer_date: new Date().toISOString(),
      transfer_status: 0
    }
    setLoading(true);
    equipmentTransferApi.transfer(data)
      .then((res: any) => {
        const { success } = res?.data;
        if(success) {
          toast.success("Tạo yêu cầu điều chuyển thành công");
          form.resetFields();
          setShowTransferModal();
          callback();
        } else {
          toast.error("Tạo yêu cầu điều chuyển thất bại")
        }
      })
      .catch(() => toast.error("Tạo yêu cầu điều chuyển thất bại"))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title="Điều chuyển thiết bị"
      open={showTransferModal}
      onCancel={setShowTransferModal}
      footer={null}
    >
      <Form form={form}  layout="vertical" size="large" onFinish={transferEquipment}>
        <Form.Item name="equipment_id" required style={{ display: "none" }}></Form.Item>
        <Form.Item label="Tên thiết bị" name="equipment_name">
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item name="from_department_id" style={{ display: "none" }}>
        </Form.Item>
        <Form.Item label="Khoa Phòng hiện tại" name="from_department_name">
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item label="Khoa Phòng điều chuyển" name="to_department_id">
          <Select placeholder="Chọn Khoa phòng" options={options(departments)}/>
        </Form.Item>
        <Form.Item label="Ngày Điều chuyển" name="transfer_date">
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <TextArea placeholder='Nhập ghi chú' className='input' />
        </Form.Item>
        <Form.Item name="create_user_id" style={{ display: "none" }}></Form.Item>
        <Form.Item label="Cán bộ lập biên bản" name="transfer_create_user" >
          <Input className='input' disabled />
        </Form.Item>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button htmlType="submit" className='button' loading={loading}>Xác nhận</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setShowTransferModal(false)} className='button'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalTransfer