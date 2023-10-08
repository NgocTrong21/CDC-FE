import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Tooltip,
} from 'antd';
import categoryApi from 'api/category.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  checkPermission,
  convertBase64,
  getCurrentUser,
  options,
} from 'utils/globalFunc.util';
import BrokenReport from './BrokenReport';
import equipmentApi from 'api/equipment.api';
import { NotificationContext } from 'contexts/notification.context';
import { report_status } from 'constants/dataFake.constant';
import { permissions } from 'constants/permission.constant';
import { downloadRepairSchedule } from 'utils/file.util';
import { formatCurrencyVN } from 'utils/validateFunc.util';
import useQuery from 'hooks/useQuery';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { TextArea } = Input;

const UpdateSchedule = () => {
  const current_user: any = getCurrentUser();
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
  const { providers } = useContext(FilterContext);
  const query: any = useQuery();
  const param: any = useParams();
  const { id, repair_id } = param;
  const [form] = Form.useForm();
  const [formApprove] = Form.useForm();
  const [status, setStatus] = useState([]);
  const [equipment, setEquipment] = useState<any>({});
  const [schedule, setSchedule] = useState({} as any);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [showApproveScheduleModal, setShowApproveScheduleModal] =
    useState(false);
  const [file, setFile] = useState<any>();
  const [estimateCost, setEstimateCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [showBrokenReportModal, setShowBrokenReportModal] =
    useState<boolean>(false);

  const handleScheduleRepairStatus = (status: any = 0) => {
    let color: any;
    if (status === 0 || status === null) color = 'text-orange-400';
    if (status === 1) color = 'text-green-500';
    if (status === 2) color = 'text-red-500';
    return (
      <span className={`${color}`}>
        {
          report_status.filter((item: any) => item.value === status)[0]
            ?.label
        }
      </span>
    );
  };

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

  const handleChange = (e: any, key: string) => {
    const formattedValue = formatCurrencyVN(e.target.value);
    if (key === 'actual_cost') {
      setActualCost(formattedValue);
    }
    if (key === 'estimate_cost') {
      setEstimateCost(formattedValue);
    }
  };

  const getRepairSchedule = () => {
    equipmentRepairApi
      .getRepairSchedule(id, repair_id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          const schedule = {
            id: data?.schedule?.id,
            equipment_id: data?.schedule?.equipment_id,
            name: data?.schedule?.Equipment?.name,
            model: data?.schedule?.Equipment?.model,
            serial: data?.schedule?.Equipment?.serial,
            department: data?.schedule?.Equipment?.Department.name,
            actual_repair_cost: data?.schedule?.actual_repair_cost,
            code: data?.schedule?.code,
            repair_date:
              data?.schedule?.repair_date &&
              moment(data?.schedule?.repair_date),
            estimated_repair_cost: data?.schedule?.estimated_repair_cost,
            provider_id: data?.schedule?.provider_id,
            repair_completion_date:
              data?.schedule?.repair_completion_date &&
              moment(data?.schedule?.repair_completion_date),
            repair_status: data?.schedule?.repair_status,
            repair_status_name: data?.schedule?.Repair_Status?.name,
            schedule_repair_date:
              data?.schedule?.schedule_repair_date &&
              moment(data?.schedule?.schedule_repair_date),
            schedule_create_user_name:
              data?.schedule?.schedule_create_user?.name || current_user?.name,
            schedule_create_user_id: data?.schedule?.schedule_create_user?.id || current_user?.id,
            test_user_name:
              data?.schedule?.test_user?.name || current_user?.name,
            schedule_approve_user_name:
              data?.schedule?.schedule_approve_user?.name || current_user?.name,
            schedule_approve_user_id:
              data?.schedule?.schedule_approve_user?.id || current_user?.id,
            schedule_repair_status: data?.schedule?.schedule_repair_status,
          };
          form.setFieldsValue(schedule);
          formApprove.setFieldsValue(schedule);
          setSchedule(schedule);
          setEstimateCost(formatCurrencyVN(schedule.estimated_repair_cost));
          setActualCost(formatCurrencyVN(schedule.actual_repair_cost));
        }
      })
      .catch();
  };

  useEffect(() => {
    getRepairSchedule();
  }, [id, repair_id]);

  const updateSchedule = (values: any) => {
    const data = {
      ...values,
      repair_date: moment(new Date(values?.repair_date)).toISOString(),
      schedule_repair_date: moment(
        new Date(values?.schedule_repair_date)
      ).toISOString(),
      schedule_repair_status: 0,
      equipment_id: id,
      id: repair_id,
      name: equipment?.name,
      department: equipment?.Department?.name,
      department_id: equipment?.Department?.id,
    };
    setLoadingUpdate(true);
    equipmentRepairApi
      .updateScheduleRepair(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success('Cập nhật phiếu sửa chữa thành công!');
          getRepairSchedule();
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Cập nhật phiếu sửa chữa thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  const approveScheduleRepair = (values: any) => {
    const data = {
      id: repair_id,
      equipment_id: values.equipment_id,
      name: equipment.name,
      department: equipment?.Department?.name,
      department_id: equipment?.Department?.id,
      schedule_repair_status: values.schedule_repair_status,
      schedule_create_user_id: schedule.schedule_create_user_id,
      schedule_approve_user_id: values.schedule_approve_user_id,
      schedule_repair_note: values?.schedule_repair_note,
    };

    setLoadingApprove(true);
    equipmentRepairApi
      .approveScheduleRepair(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Phê duyệt phiếu sửa chữa thành công!');
          getRepairSchedule();
          setShowApproveScheduleModal(false);
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Phê duyệt phiếu sửa chữa thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingApprove(false));
  };

  const acceptanceRepair = (values: any) => {
    const data = {
      ...values,
      test_user_id: current_user?.id,
      id: repair_id,
      equipment_id: values.equipment_id,
      name: equipment.name,
      department: equipment?.Department?.name,
      department_id: equipment?.Department?.id,
      repair_completion_date: moment(
        new Date(values?.repair_completion_date)
      ).toISOString(),
      file,
    };
    setLoadingUpdate(true);
    equipmentRepairApi
      .acceptanceRepair(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success('Nghiệm thu phiếu sửa chữa thành công!');
          getRepairSchedule();
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Nghiệm thu phiếu sửa chữa thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  return (
    <div>
      <div className="title text-center">{`${
        query?.edit === 'true' ? 'CẬP NHẬT' : ''
      } PHIẾU SỬA CHỮA THIẾT BỊ`}</div>
      <Divider />
      <div>
        <div className="title">
          <div className="flex items-center gap-2">
            PHIẾU SỬA CHỮA (
            <span className="italic">Mã phiếu: {schedule?.code}</span>) ___{' '}
            {handleScheduleRepairStatus(schedule?.schedule_repair_status)}
            <Tooltip title="Chi tiết phiếu báo hỏng">
              <ExclamationCircleFilled
                className="text-red-600"
                onClick={() => setShowBrokenReportModal(true)}
              />
            </Tooltip>
          </div>
        </div>
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={
            schedule.schedule_repair_status === 1
              ? acceptanceRepair
              : updateSchedule
          }
        >
          <Form.Item name="id" className="hidden"></Form.Item>
          <Form.Item name="equipment_id" className="hidden"></Form.Item>
          <Form.Item
            name="schedule_approve_user_id"
            className="hidden"
          ></Form.Item>
          <Form.Item
            name="schedule_create_user_id"
            className="hidden"
          ></Form.Item>
          <Form.Item name="test_user_id" className="hidden"></Form.Item>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Tên thiết bị" name="name">
              <Input disabled className="input" />
            </Form.Item>
            <Form.Item label="Khoa - Phòng" name="department">
              <Input disabled className="input" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Model" name="model">
              <Input disabled className="input" />
            </Form.Item>
            <Form.Item label="Serial" name="serial">
              <Input disabled className="input" />
            </Form.Item>
          </div>
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
              label={`Chi phí sửa chữa dự kiến: ${estimateCost}`}
              name="estimated_repair_cost"
              required
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập chi phí sửa chữa dự kiến!',
                },
              ]}
            >
              <Input
                className="input"
                type="text"
                onChange={(e) => handleChange(e, 'estimate_cost')}
              />
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
              label="Nghiệm thu"
              name="repair_status"
              required={schedule.schedule_repair_status === 1 ? true : false}
              rules={[
                {
                  required:
                    schedule.schedule_repair_status === 1 ? true : false,
                  message: 'Hãy chọn trạng thái thiết bị!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Nghiệm thu"
                optionFilterProp="children"
                options={options(status)}
                allowClear
                disabled={schedule.schedule_repair_status !== 1}
              />
            </Form.Item>
            <Form.Item
              label="Ngày hoàn thành sửa chữa"
              name="repair_completion_date"
              required={schedule.schedule_repair_status === 1 ? true : false}
              rules={[
                {
                  required:
                    schedule.schedule_repair_status === 1 ? true : false,
                  message: 'Hãy chọn ngày hoàn thành sửa chữa!',
                },
              ]}
            >
              <DatePicker
                className="date"
                disabled={schedule.schedule_repair_status !== 1}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              label={`Chi phí sửa chữa thực tế: ${actualCost}`}
              name="actual_repair_cost"
              required={schedule.schedule_repair_status === 1 ? true : false}
              rules={[
                {
                  required:
                    schedule.schedule_repair_status === 1 ? true : false,
                  message: 'Hãy nhập chi phí sửa chữa thực tế!',
                },
              ]}
            >
              <Input
                className="input"
                type="text"
                onChange={(e) => handleChange(e, 'actual_cost')}
                disabled={schedule.schedule_repair_status !== 1}
              />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea
                className="textarea"
                rows={1}
                disabled={schedule.schedule_repair_status !== 1}
              />
            </Form.Item>
            <Form.Item
              className="fileUploadInput"
              name="file"
              label="Tài liệu đính kèm"
            >
              <Input
                type="file"
                onChange={(e: any) => handleChangeFile(e)}
                disabled={schedule.schedule_repair_status !== 1}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              label="Người lập phiếu sửa chữa"
              name="schedule_create_user_name"
            >
              <Input className="input" disabled />
            </Form.Item>
            {schedule.schedule_repair_status !== 0 && (
              <Form.Item
                label="Người phê duyệt phiếu sửa chữa"
                name="schedule_approve_user_name"
              >
                <Input className="input" disabled />
              </Form.Item>
            )}
            {schedule.schedule_repair_status === 1 && (
              <Form.Item label="Người nghiệm thu" name="test_user_name">
                <Input className="input" disabled />
              </Form.Item>
            )}
          </div>
          <div className="flex gap-6">
            {schedule.schedule_repair_status !== 1 &&
              checkPermission(permissions.REPAIR_EQUIPMENT_APPROVE) && (
                <Form.Item>
                  <Button
                    className="button-primary"
                    onClick={() => setShowApproveScheduleModal(true)}
                  >
                    Phê duyệt
                  </Button>
                </Form.Item>
              )}
            {schedule.schedule_repair_status !== 1 &&
              checkPermission(permissions.REPAIR_EQUIPMENT_UPDATE) && (
                <Form.Item>
                  <Button
                    className="button-primary"
                    htmlType="submit"
                    loading={loadingUpdate}
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              )}
            {schedule.schedule_repair_status === 1 && (
              <>
                {equipment.status_id !== 3 &&
                  checkPermission(permissions.REPAIR_EQUIPMENT_UPDATE) && (
                    <Form.Item>
                      <Button
                        className="button-primary"
                        htmlType="submit"
                        loading={loadingUpdate}
                      >
                        Nghiệm thu sửa chữa
                      </Button>
                    </Form.Item>
                  )}
                <Form.Item>
                  <Button
                    className="button-primary"
                    onClick={() => downloadRepairSchedule(schedule)}
                  >
                    In phiếu yêu cầu sửa chữa
                  </Button>
                </Form.Item>
              </>
            )}
          </div>
        </Form>
        <Modal
          title="Phê duyệt phiếu sửa chữa thiết bị"
          open={showApproveScheduleModal}
          onCancel={() => setShowApproveScheduleModal(false)}
          footer={null}
        >
          <Form
            size="large"
            layout="vertical"
            form={formApprove}
            onFinish={approveScheduleRepair}
          >
            <Form.Item name="id" className="hidden"></Form.Item>
            <Form.Item name="equipment_id" className="hidden"></Form.Item>
            <Form.Item
              name="schedule_approve_user_id"
              className="hidden"
            ></Form.Item>
            <Form.Item
              name="schedule_create_user_id"
              className="hidden"
            ></Form.Item>
            <Form.Item
              label="Trạng thái phê duyệt"
              name="schedule_repair_status"
              required
              rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
            >
              <Radio.Group>
                <Radio value={1}>Phê duyệt</Radio>
                <Radio value={2}>Từ chối</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Ghi chú" name="schedule_repair_note">
              <TextArea placeholder="Nhập ghi chú" className="input" />
            </Form.Item>
            <div className="flex flex-row justify-end gap-4">
              <Form.Item>
                <Button
                  htmlType="submit"
                  className="button-primary"
                  loading={loadingApprove}
                >
                  Xác nhận
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={() => setShowApproveScheduleModal(false)}
                  className="button-primary"
                >
                  Đóng
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
      <Modal
        open={showBrokenReportModal}
        onCancel={() => setShowBrokenReportModal(false)}
        footer={null}
      >
        <BrokenReport />
      </Modal>
    </div>
  );
};

export default UpdateSchedule;
