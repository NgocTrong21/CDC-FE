import { Button, Form, Input, Modal, Radio } from 'antd'
import equipmentTransferApi from 'api/equipment_transfer.api';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ModalTransferApprove = (props: any) => {

  const {
    showTransferApproveModal,
    setShowTransferApproveModal,
    dataTransfer,
    callback
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(Object.keys(dataTransfer).length === 0) return;
    form.setFieldsValue({
      // id: dataTransfer?.id,
      equipment_id: dataTransfer?.equipment_id,
      equipment_name: dataTransfer?.equipment_name,
      approver_id: dataTransfer.approver_id,
      approver_name: dataTransfer.approver_name,
      from_department_id: dataTransfer?.from_department_id,
      to_department_id: dataTransfer?.to_department_id,
      from_department: dataTransfer?.from_department,
      to_department: dataTransfer?.to_department,
    })
  }, [dataTransfer])

  const handleApproverTransfer = (values: any) => {
    let data = { ...values };
    setLoading(true);
    equipmentTransferApi.approveTransferReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          setShowTransferApproveModal();
          form.resetFields();
          callback();
          toast.success("Hoàn tất quy trình điều chuyển");
        } else {
          toast.error("Quy trình điều chuyển có gặp sự cố. Vui lòng kiểm tra lại")
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title="Phê duyệt yêu cầu điều chuyển thiết bị"
      open={showTransferApproveModal}
      onCancel={setShowTransferApproveModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={handleApproverTransfer}
      >
        <Form.Item style={{ display: 'none' }}></Form.Item>
        <Form.Item name='equipment_id' style={{ display: 'none' }}></Form.Item>
        <Form.Item name='from_department_id' style={{ display: 'none' }}></Form.Item>
        <Form.Item name='to_department_id' style={{ display: 'none' }}></Form.Item>
        <Form.Item name='equipment_name' label='Tên thiết bị'>
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item name='from_department' label='Khoa phòng hiện tại'>
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item name='to_department' label='Khoa phòng điều chuyển'>
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item name='approver_id' style={{ display: 'none' }}></Form.Item>
        <Form.Item label='Người phê duyệt' name='approver_name'>
          <Input disabled className='input' />
        </Form.Item>
        <Form.Item
          label='Trạng thái phê duyệt'
          name='transfer_status'
          required
          rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
        >
          <Radio.Group>
            <Radio value={1}>Đồng ý</Radio>
            <Radio value={2}>Không đồng ý</Radio>
          </Radio.Group>
        </Form.Item>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button htmlType="submit" className='button-primary' loading={loading}>Xác nhận</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={setShowTransferApproveModal} className='button-primary'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalTransferApprove