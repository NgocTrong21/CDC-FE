import { Button, Form, Input, Modal, Select, DatePicker } from 'antd';
import departmentApi from 'api/department.api';
import equipmentHandoverApi from 'api/equipment_handover.api';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { convertBase64, options } from 'utils/globalFunc.util';

const ModalHandover = (props: any) => {
  const { showHandoverModal, setShowHandoverModal, callback, dataHandover } = props;

  const { TextArea } = Input;
  const { departments } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [employeeInCharge, setEmployeeInCharge] = useState<any>([]);
  const [employeeInUse, setEmployeeInUse] = useState<any>([]);
  const [department, setDepartment] = useState<string>('');
  const [file, setFile] = useState<any>();

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
    if (Object.keys(dataHandover).length === 0) return;
    form.setFieldsValue({
      name: dataHandover.name,
      equipment_id: dataHandover?.equipment_id,
      handover_create_id: dataHandover?.handover_create_id,
    });
  }, [dataHandover]);

  const onChangeDepartment = (value: any, label: any) => {
    setDepartment(label?.label);
    departmentApi
      .listEmployees(value)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEmployeeInCharge(data.employees);
          setEmployeeInUse(data.employees);
        }
      })
      .catch();
  };

  const handoverEquipment = (values: any) => {
    const data: any = {
      ...values,
      handover_date: moment(new Date(values?.handover_date)).toISOString(),
      department,
      file,
    };
    setLoading(true);
    equipmentHandoverApi
      .handoverEquipment(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Bàn giao thiết bị thành công!');
          form.resetFields();
          callback();
        } else {
          toast.error('Bàn giao thiết bị thất bại!');
        }
        setShowHandoverModal(false);
      })
      .catch()
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title="Bàn giao thiết bị"
      open={showHandoverModal}
      onCancel={setShowHandoverModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={handoverEquipment}
      >
        <Form.Item name="equipment_id" required style={{ display: 'none' }}>
          <Input style={{ display: 'none' }} />
        </Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item
          label="Khoa Phòng"
          name="department_id"
          required
          rules={[{ required: true, message: 'Hãy chọn khoa phòng bàn giao!' }]}
        >
          <Select
            placeholder="Chọn Khoa phòng"
            options={options(departments)}
            onChange={onChangeDepartment}
          />
        </Form.Item>
        <Form.Item
          label="Cán bộ phụ trách"
          name="handover_in_charge_id"
          required
          rules={[{ required: true, message: 'Hãy chọn cán bộ phụ trách!' }]}
        >
          <Select
            placeholder="Chọn cán bộ phụ trách"
            options={options(employeeInCharge)}
          />
        </Form.Item>
        <Form.Item
          label="Cán bộ sử dụng"
          name="users_id"
          required
          rules={[{ required: true, message: 'Hãy chọn cán bộ sử dụng!' }]}
        >
          <Select
            placeholder="Chọn cán bộ sử dụng"
            options={options(employeeInUse)}
            mode="multiple"
          />
        </Form.Item>
        <Form.Item label="Ngày bàn giao" name="handover_date">
          <DatePicker className="date" />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <TextArea placeholder="Nhập ghi chú" className="input" />
        </Form.Item>
        <Form.Item
          className="fileUploadInput"
          name="file"
          label="Tài liệu đính kèm"
        >
          <Input type="file" onChange={(e: any) => handleChangeFile(e)} />
        </Form.Item>
        <Form.Item name="handover_create_id" className="hidden"></Form.Item>
        <div className="flex flex-row justify-end gap-4">
          <Form.Item>
            <Button htmlType="submit" loading={loading} className="button-primary">
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => setShowHandoverModal(false)}
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

export default ModalHandover;
