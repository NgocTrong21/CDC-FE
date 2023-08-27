import { Button, Form, Input, Select } from 'antd';
import equipmentApi from 'api/equipment.api';
import { broken_status } from 'constants/dataFake.constant';
import moment from 'moment';
import { useEffect, useState } from 'react'
import { downloadBrokenDocx } from 'utils/file.util';

const BrokenReport = (props: any) => {

  const { id } = props;
  const [equipment, setEquipment] = useState<any>({});
  const [form] = Form.useForm();

  const getEquipmentRepairInfo = (id: number) => {
    equipmentApi.getEquipmentRepairInfo(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          let equipment = {
            id: data?.equipment?.Equipment?.id,
            name: data?.equipment?.Equipment?.name,
            model: data?.equipment?.Equipment?.model,
            serial: data?.equipment?.Equipment?.serial,
            department: data?.equipment?.Equipment?.Department.name,
            reason: data?.equipment?.reason,
            repair_priority: data?.equipment?.repair_priority,
            broken_report_date: moment(data?.equipment?.broken_report_date).format("DD-MM-YYYY"),
            reporting_person_id: data?.equipment?.reporting_user?.name
          }
          setEquipment(equipment);
          form.setFieldsValue(equipment);
        }
      })
      .catch()
  }

  useEffect(() => {
    getEquipmentRepairInfo(id);
  }, [id])

  return (
    <div>
      <div className='title'>THÔNG TIN PHIẾU BÁO HỎNG</div>
        <Form size='large' layout='vertical' form={form}>
          <Form.Item name="id" className='hidden'>
            <Input className='hidden' />
          </Form.Item>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Tên thiết bị" name="name">
              <Input disabled className='input' />
            </Form.Item>
            <Form.Item label="Khoa - Phòng" name="department">
              <Input disabled className='input' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Model" name="model">
              <Input disabled className='input' />
            </Form.Item>
            <Form.Item label="Serial" name="serial">
              <Input disabled className='input' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Lí do hỏng" name="reason">
              <Input disabled className='input' />
            </Form.Item>
            <Form.Item label="Mức độ ưu tiên" name="repair_priority">
              <Select disabled options={broken_status} />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Ngày báo hỏng" name="broken_report_date">
              <Input disabled className='input' />
            </Form.Item>
            <Form.Item label="Người báo hỏng" name="reporting_person_id">
              <Input disabled className='input' />
            </Form.Item>
          </div>
          <Form.Item>
            <Button className='button' onClick={() => downloadBrokenDocx(equipment)}>In phiếu báo hỏng</Button>
          </Form.Item>
        </Form>
    </div>
  )
}

export default BrokenReport