import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { convertBase64, options } from 'utils/globalFunc.util';

const ModalTransfer = (props: any) => {
  const { showTransferModal, setShowTransferModal, callback, dataTransfer } =
    props;

  const { TextArea } = Input;
  const { departments } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
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
    if (Object.keys(dataTransfer).length === 0) return;
    form.setFieldsValue({
      name: dataTransfer.equipment_name,
      equipment_id: dataTransfer.equipment_id,
      from_department: dataTransfer.from_department_name,
      from_department_id: dataTransfer?.from_department_id,
      transfer_create_user_id: dataTransfer?.create_user_id,
      transfer_create_user: dataTransfer?.create_user
    });
  }, [dataTransfer]);

  const transferEquipment = (values: any) => {
    const data = {
      ...values,
      transfer_date: moment(new Date(values?.transfer_date)).toISOString(),
      transfer_status: 0,
      isEdit: 0,
      file
    };
    setLoading(true);
    equipmentTransferApi
      .transfer(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success('Tạo yêu cầu điều chuyển thành công');
          form.resetFields();
          setShowTransferModal();
          callback();
        } else {
          toast.error('Tạo yêu cầu điều chuyển thất bại');
        }
      })
      .catch(() => toast.error('Tạo yêu cầu điều chuyển thất bại'))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title="Điều chuyển thiết bị"
      open={showTransferModal}
      onCancel={setShowTransferModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={transferEquipment}
      >
        <Form.Item
          name="equipment_id"
          required
          style={{ display: 'none' }}
        ></Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item
          name="from_department_id"
          style={{ display: 'none' }}
        ></Form.Item>
        <Form.Item label="Khoa Phòng hiện tại" name="from_department">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item
          label="Khoa Phòng điều chuyển"
          name="to_department_id"
          rules={[
            {
              required: true,
              message: 'Hãy chọn Khoa Phòng điều chuyển!',
            },
          ]}
        >
          <Select
            placeholder="Chọn Khoa phòng"
            options={options(departments)}
          />
        </Form.Item>
        <Form.Item
          label="Ngày Điều chuyển"
          name="transfer_date"
          rules={[
            {
              required: true,
              message: 'Hãy chọn Ngày Điều chuyển!',
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
        
        <Form.Item label="Ghi chú" name="note">
          <TextArea placeholder="Nhập ghi chú" className="input" />
        </Form.Item>
        <Form.Item
          name="transfer_create_user_id"
          className='hidden'
        ></Form.Item>
        <Form.Item label="Cán bộ lập biên bản" name="transfer_create_user">
          <Input className="input" disabled />
        </Form.Item>
        <div className="flex flex-row justify-end gap-4">
          <Form.Item>
            <Button
              htmlType="submit"
              className="button-primary"
              loading={loading}
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => setShowTransferModal(false)}
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

export default ModalTransfer;
