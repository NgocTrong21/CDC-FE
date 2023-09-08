import { Button, DatePicker, Form, Input, Modal } from 'antd';
import equipmentLiquidation from 'api/equipment_liquidation.api';
import { CURRENT_USER } from 'constants/auth.constant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';

const ModelLiquidation = (props: any) => {
  const { showLiquidationModal, setShowLiquidationModal, equipment, callback } = props;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const [file, setFile] = useState<any>('');

  const handleChangeFile = async (e: any) => {
    let file = e.target.files[0];
    if (file.size > 1000000) {
      form.resetFields(['file']);
      form.setFields([
        {
          name: 'file',
          errors: ['Vui lòng chọn file có dung lượng nhỏ hơn 1MB!'],
        },
      ]);
      return;
    } else {
      let fileBase64 = await convertBase64(file);
      setFile(fileBase64);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      equipment_id: equipment?.id,
      name: equipment?.name,
      department: equipment?.department,
      department_id: equipment?.department_id,
      create_user_id: user?.id,
    });
  }, [equipment?.id]);

  const liquidationEquipment = (values: any) => {
    const data = {
      ...values,
      liquidation_date: moment(new Date(values?.liquidation_date)).toISOString(),
      liquidation_status: 0,
      file,
      isEdit: 0,
    };
    setLoading(true)
    equipmentLiquidation.createLiquidationNote(data)
      .then((res: any) => {
        const { success } = res?.data;
        if(success) {
          toast.success("Tạo phiếu thanh lý thành công");
          callback();
        } else {
          toast.error("Tạo phiếu thanh lý thất bại")
        }
      })
      .catch()
      .finally(() => {
        setShowLiquidationModal();
        setLoading(false);
      })
  };

  return (
    <Modal
      title="Phiếu đề nghị thanh lý thiết bị"
      open={showLiquidationModal}
      onCancel={setShowLiquidationModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={liquidationEquipment}
      >
        <Form.Item name="equipment_id" required style={{ display: 'none' }}>
          <Input style={{ display: 'none' }} />
        </Form.Item>
        <Form.Item name="department_id" required style={{ display: 'none' }}>
          <Input style={{ display: 'none' }} />
        </Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item label="Khoa - Phòng" name="department">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item
          label="Ngày thanh lý"
          name="liquidation_date"
          rules={[
            {
              required: true,
              message: 'Hãy chọn Ngày thanh lý!',
            },
          ]}
        >
          <DatePicker className="date" />
        </Form.Item>
        <Form.Item
          className="fileUploadInput"
          name="file"
          label="Tài liệu đính kèm"
        >
          <Input type="file" onChange={(e: any) => handleChangeFile(e)} />
        </Form.Item>
        <Form.Item
          name="create_user_id"
          style={{ display: 'none' }}
        ></Form.Item>
        <Form.Item label="Người tạo phiếu">
          <Input value={user?.name} className="input" disabled />
        </Form.Item>
        <Form.Item
          label="Lý do thanh lý"
          name="reason"
          required
          rules={[{ required: true, message: 'Hãy nhập lý do!' }]}
        >
          <TextArea
            placeholder="Nhập tại đây..."
            rows={4}
            className="textarea"
          />
        </Form.Item>
        <div className="flex flex-row justify-end gap-4">
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className="button-primary"
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => setShowLiquidationModal(false)}
              className="button-primary"
            >
              Đóng
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModelLiquidation;
