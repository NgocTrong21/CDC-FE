import { Button, Form, Input, Modal, Radio } from 'antd';
import { CURRENT_USER } from 'constants/auth.constant';
import { report_status } from 'constants/dataFake.constant';
import { NotificationContext } from 'contexts/notification.context';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { downloadTransferDocx } from 'utils/file.util';
import { toast } from 'react-toastify';
import { checkPermission, convertBase64 } from 'utils/globalFunc.util';
import { permissions } from 'constants/permission.constant';
import Loading from 'components/Loading';
import useQuery from 'hooks/useQuery';
import equipmentTransferApi from 'api/equipment_transfer.api';

const { TextArea } = Input;

const DetailTransfer = () => {
  const [equipment, setEquipment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showApproveTransferModal, setShowApproveTransferModal] =
    useState(false);
  const current_user: any = JSON.parse(
    localStorage.getItem(CURRENT_USER) || ''
  );
  const [form] = Form.useForm();
  const query: any = useQuery();
  const param: any = useParams();
  const { id, transfer_id } = param;
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

  const handleTransferStatus = (status: any = 0) => {
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

  const detailTransfer = () => {
    setLoading(true);
    equipmentTransferApi
      .detail(id, transfer_id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const equipment = {
            id: data?.equipment?.id,
            equipment_id: data?.equipment?.Equipment?.id,
            name: data?.equipment?.Equipment?.name,
            model: data?.equipment?.Equipment?.model,
            serial: data?.equipment?.Equipment?.serial,
            from_department: data?.equipment?.from_department.name,
            from_department_id: data?.equipment?.from_department.id,
            to_department: data?.equipment?.to_department.name,
            to_department_id: data?.equipment?.to_department.id,
            code: data?.equipment?.code,
            transfer_status: data?.equipment?.transfer_status,
            transfer_date: moment(data?.equipment?.transfer_date).format(
              'hh:mm:ss, DD-MM-YYYY'
            ),
            transfer_create_user: data?.equipment?.transfer_create_user?.name,
            transfer_create_user_id: data?.equipment?.transfer_create_user?.id,
            transfer_approver_id:
              data?.equipment?.transfer_approver?.id || current_user.id,
            transfer_approver:
              data?.equipment?.transfer_approver?.name || current_user.name,
          };
          form.setFieldsValue(equipment);
          setEquipment(equipment);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    detailTransfer();
  }, [id, transfer_id]);

  const handleApproveTransfer = (values: any) => {
    const data = {
      ...equipment,
      transfer_status: values.transfer_status,
      transfer_note: values.transfer_note,
    };
    delete data.transfer_date;
    delete data.file;
    setLoadingApprove(true);
    equipmentTransferApi
      .approveTransferReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          detailTransfer();
          setShowApproveTransferModal(false);
          toast.success('Phê duyệt phiếu điều chuyển thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Phê duyệt phiếu điều chuyển thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingApprove(false));
  };

  const updateTransfer = (values: any) => {
    const data = {
      ...equipment,
      transfer_status: 0,
      file,
      isEdit: 1,
    };
    setLoadingUpdate(true);
    equipmentTransferApi
      .updateTransferReport(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          detailTransfer();
          toast.success('Cập nhật phiếu điều chuyển thành công!');
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Cập nhật phiếu điều chuyển thất bại!');
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
        PHIẾU ĐIỀU CHUYỂN (
        <span className="italic">Mã phiếu: {equipment?.code}</span>) ___{' '}
        {handleTransferStatus(equipment?.transfer_status)}
      </div>
      <Form
        size="large"
        layout="vertical"
        form={form}
        onFinish={updateTransfer}
      >
        <Form.Item name="id" className="hidden"></Form.Item>
        <Form.Item name="equipment_id" className="hidden"></Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input disabled className="input" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item label="Khoa - Phòng hiện tại" name="from_department">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item label="Khoa - Phòng điều chuyển" name="to_department">
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
          <Form.Item label="Ngày điều chuyển" name="transfer_date">
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
          <Form.Item
            name="transfer_create_user_id"
            className="hidden"
          ></Form.Item>
          <Form.Item
            label="Người tạo phiếu điều chuyển"
            name="transfer_create_user"
          >
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item label="Người phê duyệt" name="transfer_approver">
            <Input disabled className="input" />
          </Form.Item>
          <Form.Item name="transfer_approver_id" className="hidden"></Form.Item>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          {equipment.transfer_status !== 1 &&
            checkPermission(permissions.TRANFER_EQUIPMENT_APPROVE) && (
              <Form.Item>
                <Button
                  className="button-primary"
                  onClick={() => setShowApproveTransferModal(true)}
                >
                  Phê duyệt
                </Button>
              </Form.Item>
            )}

          {equipment.transfer_status !== 1 &&
            checkPermission(permissions.TRANFER_EQUIPMENT_UPDATE) && (
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
        {equipment.transfer_status === 1 && (
          <Form.Item>
            <Button
              className="button-primary"
              onClick={() => downloadTransferDocx(equipment)}
            >
              In phiếu điều chuyển
            </Button>
          </Form.Item>
        )}
      </Form>
      <Modal
        title="Phê duyệt phiếu điều chuyển thiết bị"
        open={showApproveTransferModal}
        onCancel={() => setShowApproveTransferModal(false)}
        footer={null}
      >
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={handleApproveTransfer}
        >
          <Form.Item
            label="Trạng thái phê duyệt"
            name="transfer_status"
            required
            rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
          >
            <Radio.Group>
              <Radio value={1}>Phê duyệt</Radio>
              <Radio value={2}>Từ chối</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="transfer_note">
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
                onClick={() => setShowApproveTransferModal(false)}
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

export default DetailTransfer;
