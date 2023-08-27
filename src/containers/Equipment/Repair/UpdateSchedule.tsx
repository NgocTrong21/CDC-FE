import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import categoryApi from 'api/category.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';
import BrokenReport from './BrokenReport';
import { CURRENT_USER } from 'constants/auth.constant';


const { TextArea } = Input;

const UpdateSchedule = () => {
  const current_user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '')

  const navigate = useNavigate();
  const { providers } = useContext(FilterContext);
  const param: any = useParams();
  const { id, repair_id } = param;
  const [form] = Form.useForm();
  const [status, setStatus] = useState([]);

  const getRepairStatus = () => {
    categoryApi.listRepairStatus()
      .then((res: any) => {
        const { data } = res?.data;
        setStatus(data?.repair_status);
      })
      .catch()
  }

  useEffect(() => {
    getRepairStatus();
  }, [])

  const getRepairSchedule = (id: number) => {
    equipmentRepairApi.getRepairSchedule(id)
      .then((res: any) => {
        const { success, data } = res?.data;    
        if (success) {
          form.setFieldsValue({
            actual_repair_cost: data?.schedule?.actual_repair_cost,
            repair_date: data?.schedule?.repair_date && moment(data?.schedule?.repair_date),
            estimated_repair_cost: data?.schedule?.estimated_repair_cost,
            provider_id: data?.schedule?.provider_id,
            repair_completion_date: data?.schedule?.repair_completion_date && moment(data?.schedule?.repair_completion_date),
            repair_status: data?.schedule?.repair_status,
            schedule_repair_date: data?.schedule?.schedule_repair_date && moment(data?.schedule?.schedule_repair_date),
            schedule_create_user_name: data?.schedule?.schedule_create_user?.name,
            test_user_name: data?.schedule?.test_user?.name || current_user?.name
          })
        }
      })
  }

  useEffect(() => {
    getRepairSchedule(repair_id);
  }, [repair_id])

  const updateSchedule = (values: any) => {
    let data = {
      ...values,
      repair_completion_date: moment(new Date(values?.repair_completion_date)).toISOString(),
      repair_date: moment(new Date(values?.repair_date)).toISOString(),
      schedule_repair_date: moment(new Date(values?.schedule_repair_date)).toISOString(),
      equipment_id: id,
      id: repair_id,
      test_user_id: current_user?.id
    }
    
    equipmentRepairApi.updateScheduleRepair(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          navigate(`/equipment/repair/history/${id}`);
        } else {
          toast.error('Cập nhật lịch sửa chữa thất bại')
        }
      })
  }

  return (
    <div>
      <div className="title text-center">CẬP NHẬT LỊCH SỬA CHỮA THIẾT BỊ</div>
      <Divider />
      <BrokenReport id={id} />
      <Divider />
      <div>
        <div className='title'>KẾ HOẠCH SỬA CHỮA</div>
        <Form size='large' layout='vertical' form={form} onFinish={updateSchedule}>
          <Form.Item name="equipment_id" className='hidden'>
            <Input className='hidden' />
          </Form.Item>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label='Ngày lên lịch sửa' name='schedule_repair_date'>
              <DatePicker className='date' />
            </Form.Item>
            <Form.Item label='Ngày sửa chữa' name='repair_date'>
              <DatePicker className='date' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label='Chi phí sửa chữa dự kiến' name='estimated_repair_cost'>
              <Input className='input' />
            </Form.Item>
            <Form.Item label='Nhà cung cấp dịch vụ' name='provider_id'>
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp dịch vụ"
                optionFilterProp="children"
                options={options(providers)}
                allowClear
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label='Nghiệm thu' name='repair_status'>
              <Select
                showSearch
                placeholder="Nghiệm thu"
                optionFilterProp="children"
                options={options(status)}
                allowClear
              />
            </Form.Item>
            <Form.Item label='Ngày sửa xong' name='repair_completion_date'>
              <DatePicker className='date' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label='Chi phí sửa chữa thực tế' name='actual_repair_cost'>
              <Input className='input' />
            </Form.Item>
            <Form.Item label='Ghi chú' name='note'>
              <TextArea className='textarea' rows={1} />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label='Người lập kế hoạch sửa chữa' name='schedule_create_user_name'>
              <Input className='input' disabled />
            </Form.Item>
            <Form.Item label='Người nghiệm thu' name='test_user_name'>
              <Input className='input' disabled />
            </Form.Item>
          </div>
          <div className='flex gap-6'>
            <Form.Item>
              <Button className='button' htmlType="submit">Cập nhật</Button>
            </Form.Item>
            <Form.Item>
              <Button className='button' >In phiếu yêu cầu sửa chữa</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default UpdateSchedule