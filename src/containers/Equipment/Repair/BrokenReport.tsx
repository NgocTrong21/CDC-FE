import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import equipmentRepairApi from 'api/equipment_repair.api';
import { CURRENT_USER } from 'constants/auth.constant';
import { broken_status, report_status } from 'constants/dataFake.constant';
import { NotificationContext } from 'contexts/notification.context';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadBrokenDocx } from 'utils/file.util';
import { toast } from 'react-toastify';
import { checkPermission } from 'utils/globalFunc.util';
import { permissions } from 'constants/permission.constant';
import Loading from 'components/Loading';
const { TextArea } = Input;

const BrokenReport = () => {
  const [equipment, setEquipment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showApproveReportModal, setShowApproveReportModal] = useState(false);
  const current_user: any = JSON.parse(
    localStorage.getItem(CURRENT_USER) || ''
  );
  const [form] = Form.useForm();
  const param: any = useParams();
  const { id, repair_id } = param;
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);

  const handleReportStatus = (status: any = 0) => {
    let color: any;
    if (status === 0) color = 'text-orange-400';
    if (status === 1) color = 'text-green-500';
    if (status === 2) color = 'text-red-500';
    return (
      <span className={`${color}`}>
        {report_status.filter((item: any) => item.value === status)[0]?.label}
      </span>
    );
  };

  const getBrokenReport = () => {
    setLoading(true);
    equipmentRepairApi
      .getBrokenReport(id, repair_id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          let equipment = {
            id: data?.equipment?.id,
            equipment_id: data?.equipment?.Equipment?.id,
            name: data?.equipment?.Equipment?.name,
            model: data?.equipment?.Equipment?.model,
            serial: data?.equipment?.Equipment?.serial,
            department: data?.equipment?.Equipment?.Department.name,
            department_id: data?.equipment?.Equipment?.Department.id,
            code: data?.equipment?.code,
            reason: data?.equipment?.reason,
            repair_priority: data?.equipment?.repair_priority,
            report_status: data?.equipment?.report_status,
            broken_report_date: moment(
              data?.equipment?.broken_report_date
            ).format('hh:mm:ss, DD-MM-YYYY'),
            reporting_person: data?.equipment?.reporting_user?.name,
            reporting_person_id: data?.equipment?.reporting_user?.id,
            approve_broken_report_date: data?.equipment
              ?.approve_broken_report_date
              ? moment(data?.equipment?.approve_broken_report_date).format(
                  'hh:mm:ss, DD-MM-YYYY'
                )
              : moment(new Date()).format('DD-MM-YYYY'),
            approve_report_person_id:
              data?.equipment?.approve_report_person?.id || current_user.id,
            approve_report_person:
              data?.equipment?.approve_report_person?.name || current_user.name,
          };
          form.setFieldsValue(equipment);
          setEquipment(equipment);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getBrokenReport();
  }, [id, repair_id]);

  const handleApproveBrokenReport = (values: any) => {
    const data = {
      id: equipment.id,
      equipment_id: equipment.equipment_id,
      approve_report_person_id: equipment.approve_report_person_id,
      approve_broken_report_date: moment(
        new Date(equipment.approve_broken_report_date)
      ).toISOString(),
      report_status: values.report_status,
      report_note: values.report_note,
      name: equipment.name,
      department: equipment.department,
      department_id: equipment.department_id,
      reporting_person_id: equipment.reporting_person_id,
      isEdit: 1
    };
    setLoadingApprove(true);
    equipmentRepairApi
      .approveBrokenReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          getBrokenReport();
          setShowApproveReportModal(false);
          toast.success('Phê duyệt phiếu báo hỏng thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Phê duyệt phiếu báo hỏng thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingApprove(false));
  };

  const updateBrokenReport = (values: any) => {
    const data = {
      id: equipment.id,
      equipment_id: equipment.equipment_id,
      department_id: equipment.department_id,
      name: equipment.name,
      department: equipment.department,
      reporting_person_id: equipment.reporting_person_id,
      report_status: 0,
      reason: values.reason,
      repair_priority: values.repair_priority,
    };
    setLoadingUpdate(true);
    equipmentRepairApi
      .updateBrokenReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          getBrokenReport();
          toast.success('Cập nhật phiếu báo hỏng thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Cập nhật phiếu báo hỏng thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className="title">
        PHIẾU BÁO HỎNG (
        <span className="italic">Mã phiếu: {equipment?.code}</span>) ___{' '}
        {handleReportStatus(equipment?.report_status)}
      </div>
      <Form
        size="large"
        layout="vertical"
        form={form}
        onFinish={updateBrokenReport}
      >
        <Form.Item name="id" className="hidden"></Form.Item>
        <Form.Item name="equipment_id" className="hidden"></Form.Item>
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
          <Form.Item label="Lí do hỏng" name="reason">
            <Input
              disabled={equipment?.report_status === 1}
              className="input"
            />
          </Form.Item>
          <Form.Item label="Mức độ ưu tiên" name="repair_priority">
            <Select
              disabled={equipment?.report_status === 1}
              options={broken_status}
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="Ngày báo hỏng" name="broken_report_date">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item name="reporting_person_id" className="hidden"></Form.Item>
          <Form.Item label="Người báo hỏng" name="reporting_person">
            <Input disabled className="input" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="Ngày phê duyệt" name="approve_broken_report_date">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item label="Người phê duyệt" name="approve_report_person">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item
            name="approve_report_person_id"
            className="hidden"
          ></Form.Item>
        </div>
        <div className="flex items-center justify-center gap-4">
          {equipment.report_status !== 1 &&
            checkPermission(permissions.REPORT_EQUIPMENT_APPROVE) && (
              <Form.Item>
                <Button
                  className="button-primary"
                  onClick={() => setShowApproveReportModal(true)}
                >
                  Phê duyệt
                </Button>
              </Form.Item>
            )}

          {equipment.report_status !== 1 &&
            checkPermission(permissions.REPORT_EQUIPMENT_UPDATE) && (
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
        </div>
        {equipment.report_status === 1 && (
          <Form.Item>
            <Button
              className="button-primary"
              onClick={() => downloadBrokenDocx(equipment)}
            >
              In phiếu báo hỏng
            </Button>
          </Form.Item>
        )}
      </Form>
      <Modal
        title="Phê duyệt phiếu báo hỏng thiết bị"
        open={showApproveReportModal}
        onCancel={() => setShowApproveReportModal(false)}
        footer={null}
      >
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={handleApproveBrokenReport}
        >
          <Form.Item
            label="Trạng thái phê duyệt"
            name="report_status"
            required
            rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
          >
            <Radio.Group>
              <Radio value={1}>Phê duyệt</Radio>
              <Radio value={2}>Từ chối</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="report_note">
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
                onClick={() => setShowApproveReportModal(false)}
                className="button-primary"
              >
                Đóng
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BrokenReport;
