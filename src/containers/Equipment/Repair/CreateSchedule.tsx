import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import categoryApi from 'api/category.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkPermission, options } from 'utils/globalFunc.util';
import BrokenReport from './BrokenReport';
import { CURRENT_USER } from 'constants/auth.constant';
import equipmentApi from 'api/equipment.api';
import { NotificationContext } from 'contexts/notification.context';
import { permissions } from 'constants/permission.constant';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const { TextArea } = Input;

const CreateSchedule = () => {
  const current_user: any = JSON.parse(
    localStorage.getItem(CURRENT_USER) || ''
  );
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
  const navigate = useNavigate();
  const { providers } = useContext(FilterContext);
  const param: any = useParams();
  const { id, repair_id } = param;
  const [form] = Form.useForm();
  const [status, setStatus] = useState([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [equipment, setEquipment] = useState<any>({});
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: any) => {
    const formattedValue = formatCurrencyVN(e.target.value);
    setInputValue(formattedValue);
  };

  const loadData = async () => {
    const [repair_status, equipment] = await Promise.all([
      await categoryApi.listRepairStatus(),
      await equipmentApi.detailBasic(id),
    ]);
    setEquipment(equipment?.data?.data?.equipment);
    setStatus(repair_status?.data?.data?.repair_status);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    form.setFieldValue('schedule_create_user_id', current_user?.id);
    form.setFieldValue('schedule_create_user_name', current_user?.name);
  }, [current_user?.id]);

  const createSchedule = (values: any) => {
    const data = {
      ...values,
      repair_completion_date: moment(
        new Date(values?.repair_completion_date)
      ).toISOString(),
      repair_date: moment(new Date(values?.repair_date)).toISOString(),
      schedule_repair_date: moment(
        new Date(values?.schedule_repair_date)
      ).toISOString(),
      equipment_id: id,
      id: repair_id,
      schedule_create_user_id: current_user?.id,
      name: equipment?.name,
      department: equipment?.Department?.name,
      department_id: equipment?.Department?.id,
      schedule_repair_status: 0,
      isEdit: 0
    };
    setLoadingCreate(true);
    equipmentRepairApi
      .createScheduleRepair(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success('Tạo phiếu sửa chữa thành công!');
          navigate(`/equipment/repair/update_schedule/${id}/${repair_id}`);
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Tạo phiếu sửa chữa thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingCreate(false));
  };

  return (
    <div>
      <div className="title text-center">TẠO PHIẾU SỬA CHỮA THIẾT BỊ</div>
      <Divider />
      <div>
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={createSchedule}
        >
          <Form.Item name="equipment_id" className="hidden">
            <Input className="hidden" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Ngày lên lịch sửa chữa"
              name="schedule_repair_date"
              required
              rules={[
                { required: true, message: 'Hãy chọn ngày lên lịch sửa chữa!' },
              ]}
            >
              <DatePicker className="date" />
            </Form.Item>
            <Form.Item
              label="Ngày sửa chữa"
              name="repair_date"
              required
              rules={[{ required: true, message: 'Hãy chọn ngày sửa chữa!' }]}
            >
              <DatePicker className="date" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label={`Chi phí sửa chữa dự kiến: ${inputValue}`}
              name="estimated_repair_cost"
              required
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập chi phí sửa chữa dự kiến!',
                },
              ]}
            >
              <Input className="input" type="text" onChange={handleChange} />
            </Form.Item>
            <Form.Item label="Nhà cung cấp dịch vụ" name="provider_id">
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp dịch vụ"
                optionFilterProp="children"
                options={options(providers)}
                allowClear
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Người lập kế hoạch sửa chữa"
              name="schedule_create_user_name"
            >
              <Input className="input" disabled />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea className="textarea" rows={1} />
            </Form.Item>
          </div>
          {checkPermission(permissions.REPAIR_EQUIPMENT_CREATE) && (
            <div className="flex gap-6">
              <Form.Item>
                <Button
                  className="button-primary"
                  htmlType="submit"
                  loading={loadingCreate}
                >
                  Thêm
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
      <Divider />
      <BrokenReport />
    </div>
  );
};

export default CreateSchedule;
