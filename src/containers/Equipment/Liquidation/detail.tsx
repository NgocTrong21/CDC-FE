import { Button, Form, Input, Modal, Radio } from 'antd';
import { CURRENT_USER } from 'constants/auth.constant';
import { report_status } from 'constants/dataFake.constant';
import { NotificationContext } from 'contexts/notification.context';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadLiquidationDocx } from 'utils/file.util';
import { toast } from 'react-toastify';
import { checkPermission, convertBase64 } from 'utils/globalFunc.util';
import { permissions } from 'constants/permission.constant';
import Loading from 'components/Loading';
import useQuery from 'hooks/useQuery';
import equipmentLiquidationApi from 'api/equipment_liquidation.api';

const { TextArea } = Input;

const DetailLiquidation = () => {
  const [equipment, setEquipment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showApproveLiquidationModal, setShowApproveLiquidationModal] =
    useState(false);
  const current_user: any = JSON.parse(
    localStorage.getItem(CURRENT_USER) || ''
  );
  const [form] = Form.useForm();
  const query: any = useQuery();
  const param: any = useParams();
  const { id, liquidation_id } = param;
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
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

  const handleLiquidationStatus = (status: any = 0) => {
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

  const detailLiquidation = () => {
    setLoading(true);
    equipmentLiquidationApi
      .getLiquidationDetail(id, liquidation_id)
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
            liquidation_status: data?.equipment?.liquidation_status,
            liquidation_date: moment(data?.equipment?.liquidation_date).format(
              'hh:mm:ss, DD-MM-YYYY'
            ),
            create_user: data?.equipment?.create_user?.name,
            create_user_id: data?.equipment?.create_user?.id,
            approver_id: data?.equipment?.approver?.id || current_user.id,
            approver: data?.equipment?.approver?.name || current_user.name,
          };
          form.setFieldsValue(equipment);
          setEquipment(equipment);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    detailLiquidation();
  }, [id, liquidation_id]);

  const handleApproveLiquidation = (values: any) => {
    const data = {
      ...equipment,
      liquidation_status: values.liquidation_status,
      liquidation_note: values.liquidation_note,
    };
    delete data.liquidation_date;
    delete data.file;
    setLoadingApprove(true);
    equipmentLiquidationApi
      .approveLiquidationNote(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          detailLiquidation();
          setShowApproveLiquidationModal(false);
          toast.success('Phê duyệt phiếu thanh lý thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Phê duyệt phiếu thanh lý thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingApprove(false));
  };

  const updateliquidation = (values: any) => {
    const data = {
      ...equipment,
      liquidation_status: 0,
      file,
      isEdit: 1,
    };
    setLoadingUpdate(true);
    equipmentLiquidationApi
      .updateLiquidationNote(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          detailLiquidation();
          toast.success('Cập nhật phiếu thanh lý thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Cập nhật phiếu thanh lý thất bại!');
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
        PHIẾU THANH LÝ (
        <span className="italic">Mã phiếu: {equipment?.code}</span>) ___{' '}
        {handleLiquidationStatus(equipment?.liquidation_status)}
      </div>
      <Form
        size="large"
        layout="vertical"
        form={form}
        onFinish={updateliquidation}
      >
        <Form.Item name="id" className="hidden"></Form.Item>
        <Form.Item name="equipment_id" className="hidden"></Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input disabled className="input" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="Model" name="model">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item label="Serial" name="serial">
            <Input disabled className="input" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="Ngày thanh lý" name="liquidation_date">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item
            label="Tài liệu đính kèm"
            name="file"
            className="fileUploadInput"
          >
            <Input type="file" onChange={(e: any) => handleChangeFile(e)} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item name="create_user_id" className="hidden"></Form.Item>
          <Form.Item label="Người tạo phiếu thanh lý" name="create_user">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item label="Người phê duyệt" name="approver">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item name="approver_id" className="hidden"></Form.Item>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          {equipment.liquidation_status !== 1 &&
            checkPermission(permissions.LIQUIDATION_EQUIPMENT_APPROVE) && (
              <Form.Item>
                <Button
                  className="button-primary"
                  onClick={() => setShowApproveLiquidationModal(true)}
                >
                  Phê duyệt
                </Button>
              </Form.Item>
            )}

          {equipment.liquidation_status !== 1 &&
            checkPermission(permissions.LIQUIDATION_EQUIPMENT_UPDATE) && (
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
        {equipment.liquidation_status === 1 && (
          <Form.Item>
            <Button
              className="button-primary"
              onClick={() => downloadLiquidationDocx(equipment)}
            >
              In phiếu thanh lý
            </Button>
          </Form.Item>
        )}
      </Form>
      <Modal
        title="Phê duyệt phiếu thanh lý thiết bị"
        open={showApproveLiquidationModal}
        onCancel={() => setShowApproveLiquidationModal(false)}
        footer={null}
      >
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={handleApproveLiquidation}
        >
          <Form.Item
            label="Trạng thái phê duyệt"
            name="liquidation_status"
            required
            rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
          >
            <Radio.Group>
              <Radio value={1}>Phê duyệt</Radio>
              <Radio value={2}>Từ chối</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="liquidation_note">
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
                onClick={() => setShowApproveLiquidationModal(false)}
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

export default DetailLiquidation;
