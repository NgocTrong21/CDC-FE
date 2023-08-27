import { Button, Form, Input, Modal, Select } from 'antd'
import equipmentHandoverApi from 'api/equipment_handover.api'
import { FilterContext } from 'contexts/filter.context'
import moment from 'moment'
import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { downloadHandoverDocx } from 'utils/file.util'
import { options } from 'utils/globalFunc.util'

const ModalHandover = (props: any) => {

  const {
    showHandoverModal,
    setShowHandoverModal,
    callback,
    onChangeDepartment,
    employeeInCharge,
    employeeInUse,
    setDataHandoverSuccess,
    dataHandover
  } = props;

  const { TextArea } = Input;
  const { departments } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(Object.keys(dataHandover).length === 0) return;
    form.setFieldsValue({
      name: dataHandover.name,
      equipment_id: dataHandover?.equipment_id,
      handover_create_id: dataHandover?.handover_create_id,
      handover_date: moment(new Date()).format("DD-MM-YYYY")
    })
  }, [dataHandover])

  const handoverEquipment = (values: any) => {
    let data: any = {
      ...values,
      handover_date: new Date().toISOString()
    }
    setLoading(true);
    equipmentHandoverApi.handoverEquipment(data)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          toast.success("Bàn giao thiết bị thành công!");
          form.resetFields();
          callback();
          let equipment = {
            name: data?.equipment?.Equipment?.name,
            model: data?.equipment?.Equipment?.model,
            serial: data?.equipment?.Equipment?.serial,
            user_id: data?.equipment?.handover_in_charge?.name ,
            department: data?.equipment?.Department?.name,
            department_id: data?.equipment?.Department?.id,
            handover_date: moment(data?.equipment?.handover_date).format("DD-MM-YYYY"),
            handover_person_id: data?.equipment?.handover_create?.name
          }
          downloadHandoverDocx(equipment);
          setDataHandoverSuccess(equipment);
        } else {
          toast.error("Bàn giao thiết bị thất bại!");
        }
        setShowHandoverModal(false);
      })
      .catch()
      .finally(() => setLoading(false))
  }

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
        <Form.Item
          name="equipment_id"
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
            mode='multiple'
          />
        </Form.Item>
        <Form.Item
          label="Ngày bàn giao"
          name="handover_date"
        >
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <TextArea
            placeholder='Nhập ghi chú'
            className='input'
          />
        </Form.Item>
        <Form.Item name="handover_create_id" className='hidden'></Form.Item>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className='button'
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => setShowHandoverModal(false)}
              className='button'
            >
              Đóng
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalHandover