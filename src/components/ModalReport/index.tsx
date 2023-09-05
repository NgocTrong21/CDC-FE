import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import equipmentRepairApi from 'api/equipment_repair.api';
import { NotificationContext } from 'contexts/notification.context';
import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const ModalReport = (props: any) => {

  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const {
    showReportModal,
    setShowReportModal,
    callback,
    dataReport,
  } = props;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(Object.keys(dataReport).length === 0) return;
    form.setFieldsValue({
      name: dataReport.name,
      equipment_id: dataReport.equipment_id,
      department_id: dataReport.department_id,
      department: dataReport?.department,
      reporting_person_id: dataReport?.reporting_person_id,
    })
  }, [dataReport])

  const reportEquipment = (values: any) => {
    setLoading(true);
    const data: any = {
      ...values,
      broken_report_date: moment(new Date(values?.broken_report_date)).toISOString(),
      isEdit: 0
    }
    equipmentRepairApi.reportEquipment(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success("Báo hỏng thiết bị thành công!");
          form.resetFields();
          increaseCount();
          getAllNotifications();
          callback();
        } else {
          toast.error("Báo hỏng thiết bị thất bại!");
        }
      })
      .catch()
      .finally(() => {
        setLoading(false);
        setShowReportModal(false);
      })
  }

  return (
    <Modal
      title="Báo hỏng thiết bị"
      open={showReportModal}
      onCancel={setShowReportModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={reportEquipment}
      >
        <Form.Item
          name="equipment_id"
          required
          style={{ display: "none" }}
        >
          <Input style={{ display: "none" }} />
        </Form.Item>
        <Form.Item
          name="code"
          required
          style={{ display: "none" }}
        >
          <Input style={{ display: "none" }} />
        </Form.Item>
        <Form.Item
          label="Tên thiết bị"
          name="name"
        >
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item
          name="department_id"
          required
          style={{ display: "none" }}
        >
          <Input style={{ display: "none" }} />
        </Form.Item>
        <Form.Item
          label="Khoa - Phòng"
          name="department"
        >
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item
          label="Lý do hỏng"
          name="reason"
          required
          rules={[{ required: true, message: 'Hãy nhập lý do hỏng!' }]}
        >
          <TextArea
            placeholder='Nhập tại đây...'
            rows={4}
            className='textarea'
          />
        </Form.Item>
        <Form.Item
          label="Mức độ quan trọng"
          name="repair_priority"
          required
          rules={[{ required: true, message: 'Hãy chọn mức độ quan trọng!' }]}
        >
          <Radio.Group>
            <Radio value={1}>Cao</Radio>
            <Radio value={2}>Trung bình</Radio>
            <Radio value={3}>Thấp</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Ngày báo hỏng"
          name="broken_report_date"
        >
          <DatePicker className="date" />
        </Form.Item>
        <Form.Item
          name="reporting_person_id"
          style={{ display: 'none' }}
        >
        </Form.Item>
        <Form.Item
          name="report_status"
          style={{ display: 'none' }}
        >
        </Form.Item>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className='button-primary'
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => setShowReportModal(false)}
              className='button-primary'
            >
              Đóng
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalReport