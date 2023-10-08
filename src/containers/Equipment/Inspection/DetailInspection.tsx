import { Button, Form, Input, Modal, Radio } from 'antd';
import { CURRENT_USER } from 'constants/auth.constant';
import { report_status } from 'constants/dataFake.constant';
import { NotificationContext } from 'contexts/notification.context';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadBrokenDocx } from 'utils/file.util';
import { toast } from 'react-toastify';
import { checkPermission, convertBase64 } from 'utils/globalFunc.util';
import { permissions } from 'constants/permission.constant';
import Loading from 'components/Loading';
import equipmentInspectionApi from 'api/equipment_inspection.api';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import './index.css';
import useQuery from 'hooks/useQuery';
const mdParser = new MarkdownIt(/* Markdown-it options */);

const { TextArea } = Input;

const DetailInspection = () => {
  const [equipment, setEquipment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showApproveInspectionModal, setShowApproveInspectionModal] =
    useState(false);
  const current_user: any = JSON.parse(
    localStorage.getItem(CURRENT_USER) || ''
  );
  const [form] = Form.useForm();
  const query: any = useQuery();
  const param: any = useParams();
  const { id, inspection_id } = param;
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
  const [html, setHtml] = useState<any>('');
  const [file, setFile] = useState<any>('');
  const [text, setText] = useState<any>('');

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

  const handleInspectionStatus = (status: any = 0) => {
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

  const detailInspection = () => {
    setLoading(true);
    equipmentInspectionApi
      .detailInspection(id, inspection_id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const equipment = {
            id: data?.equipment?.id,
            equipment_id: data?.equipment?.Equipment?.id,
            name: data?.equipment?.Equipment?.name,
            model: data?.equipment?.Equipment?.model,
            serial: data?.equipment?.Equipment?.serial,
            department: data?.equipment?.Equipment?.Department.name,
            department_id: data?.equipment?.Equipment?.Department.id,
            code: data?.equipment?.code,
            file: data?.equipment?.file,
            html: data?.equipment?.html,
            text: data?.equipment?.text,
            inspection_status: data?.equipment?.inspection_status,
            inspection_date: moment(data?.equipment?.inspection_date).format(
              'hh:mm:ss, DD-MM-YYYY'
            ),
            inspection_create_user:
              data?.equipment?.inspection_create_user?.name,
            inspection_create_user_id:
              data?.equipment?.inspection_create_user?.id,
            inspection_approve_user_id:
              data?.equipment?.inspection_approve_user?.id || current_user.id,
            inspection_approve_user:
              data?.equipment?.inspection_approve_user?.name ||
              current_user.name,
          };
          form.setFieldsValue(equipment);
          setEquipment(equipment);
          setHtml(equipment.html);
          setText(equipment.text);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    detailInspection();
  }, [id, inspection_id]);

  const handleApproveInspection = (values: any) => {
    const data = {
      id: equipment.id,
      equipment_id: equipment.equipment_id,
      name: equipment.name,
      department: equipment.department,
      department_id: equipment.department_id,
      inspection_approve_user_id: equipment.inspection_approve_user_id,
      inspection_create_user_id: equipment.inspection_create_user_id,
      inspection_status: values.inspection_status,
      inspection_note: values.inspection_note,
    };
    setLoadingApprove(true);
    equipmentInspectionApi
      .approveInspectionReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          detailInspection();
          setShowApproveInspectionModal(false);
          toast.success('Phê duyệt phiếu kiểm định thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Phê duyệt phiếu kiểm định thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingApprove(false));
  };

  const updateInspection = (values: any) => {
    const data = {
      id: equipment.id,
      equipment_id: equipment.equipment_id,
      department_id: equipment.department_id,
      name: equipment.name,
      department: equipment.department,
      inspection_status: 0,
      file,
      html,
      text,
      inspection_create_user_id: equipment.inspection_create_user_id,
      isEdit: 1,
    };
    setLoadingUpdate(true);
    equipmentInspectionApi
      .updateInspectionReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          detailInspection();
          toast.success('Cập nhật phiếu kiểm định thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Cập nhật phiếu kiểm định thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  const handleChange = ({ html, text }: any) => {
    setHtml(html);
    setText(text);
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className="title">
        PHIẾU KIỂM ĐỊNH (
        <span className="italic">Mã phiếu: {equipment?.code}</span>) ___{' '}
        {handleInspectionStatus(equipment?.inspection_status)}
      </div>
      <Form
        size="large"
        layout="vertical"
        form={form}
        onFinish={updateInspection}
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
          <Form.Item label="Ngày kiểm định" name="inspection_date">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item
            name="inspection_create_user_id"
            className="hidden"
          ></Form.Item>
          <Form.Item
            label="Người tạo phiếu kiểm định"
            name="inspection_create_user"
          >
            <Input disabled className="input" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item
            label="Tài liệu đính kèm"
            name="file"
            className="fileUploadInput"
          >
            <Input type="file" onChange={(e: any) => handleChangeFile(e)} />
          </Form.Item>
          <Form.Item label="Người phê duyệt" name="inspection_approve_user">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item
            name="inspection_approve_user_id"
            className="hidden"
          ></Form.Item>
        </div>
        <div>
          <div className="mb-4">Nội dung kiểm định</div>
          {query?.edit === 'true' ? (
            <MdEditor
              value={text}
              style={{ height: '500px' }}
              renderHTML={(text: string) => mdParser.render(text)}
              onChange={handleChange}
            />
          ) : (
            <div id="customer" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          {equipment.inspection_status !== 1 &&
            checkPermission(permissions.ACCREDITATION_EQUIPMENT_APPROVE) && (
              <Form.Item>
                <Button
                  className="button-primary"
                  onClick={() => setShowApproveInspectionModal(true)}
                >
                  Phê duyệt
                </Button>
              </Form.Item>
            )}

          {equipment.inspection_status !== 1 &&
            checkPermission(permissions.ACCREDITATION_EQUIPMENT_UPDATE) && (
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
        {equipment.inspection_status === 1 && (
          <Form.Item>
            <Button
              className="button-primary"
              onClick={() => downloadBrokenDocx(equipment)}
            >
              In phiếu kiểm định
            </Button>
          </Form.Item>
        )}
      </Form>
      <Modal
        title="Phê duyệt phiếu kiểm định thiết bị"
        open={showApproveInspectionModal}
        onCancel={() => setShowApproveInspectionModal(false)}
        footer={null}
      >
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={handleApproveInspection}
        >
          <Form.Item
            label="Trạng thái phê duyệt"
            name="inspection_status"
            required
            rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
          >
            <Radio.Group>
              <Radio value={1}>Phê duyệt</Radio>
              <Radio value={2}>Từ chối</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="inspection_note">
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
                onClick={() => setShowApproveInspectionModal(false)}
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

export default DetailInspection;
