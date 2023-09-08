import { InfoCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Divider, Modal, Table } from 'antd';
import roleApi from 'api/role.api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EmailConfig = () => {
  const [showEmailConfigModal, setShowEmailConfigModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [handover, setHandover] = useState([]);
  const [requestBroken, setRequestBroken] = useState([]);
  const [approveBroken, setApproveBroken] = useState([]);
  const [requestRepair, setRepairBefore] = useState([]);
  const [approveRepair, setRepairAfter] = useState([]);
  const [acceptanceRepair, setAcceptanceRepair] = useState([]);
  const [reHandover, setReHandover] = useState([]);
  const [requestInspection, setRequestInspection] = useState([]);
  const [approveInspection, setApproveInspection] = useState([]);
  const [requestTransfer, setRequestTransfer] = useState([]);
  const [approveTransfer, setApproveTransfer] = useState([]);
  const [requestLiquidation, setRequestLiquidation] = useState([]);
  const [approveLiquidation, setApproveLiquidation] = useState([]);

  const handleColumms = (data: any, setData: any) => {
    const columns: any = [
      {
        title: 'Vai trò',
        render: (item: any) => <>{item?.Role?.name}</>,
      },
      {
        title: 'Trạng thái',
        render: (item: any) => (
          <Checkbox
            checked={item.check === 1 ? true : false}
            onChange={(e: any) => handleChangeRole(e, item, data, setData)}
          />
        ),
      },
    ];
    return columns;
  };

  const getListRoleEmail = () => {
    setLoading(true);
    roleApi
      .listRoleEmailConfig()
      .then((res: any) => {
        const { data } = res.data;

        let handover: any = [],
          requestBroken: any = [],
          approveBroken: any = [],
          requestRepair: any = [],
          approveRepair: any = [],
          acceptanceRepair: any = [],
          reHandover: any = [],
          requestInspection: any = [],
          approveInspection: any = [],
          requestTransfer: any = [],
          approveTransfer: any = [],
          requestLiquidation: any = [],
          approveLiquidation: any = [];
        console.log('data?.roles', data?.roles);

        data?.roles?.forEach((role: any) => {
          if (role.action_id === 1) {
            handover.push(role);
          }
          if (role.action_id === 2) {
            requestBroken.push(role);
          }
          if (role.action_id === 3) {
            approveBroken.push(role);
          }
          if (role.action_id === 4) {
            requestRepair.push(role);
          }
          if (role.action_id === 5) {
            approveRepair.push(role);
          }
          if (role.action_id === 6) {
            acceptanceRepair.push(role);
          }
          if (role.action_id === 7) {
            reHandover.push(role);
          }
          if (role.action_id === 8) {
            requestInspection.push(role);
          }
          if (role.action_id === 9) {
            approveInspection.push(role);
          }
          if (role.action_id === 10) {
            requestTransfer.push(role);
          }
          if (role.action_id === 11) {
            approveTransfer.push(role);
          }
          if (role.action_id === 12) {
            requestLiquidation.push(role);
          }
          if (role.action_id === 13) {
            approveLiquidation.push(role);
          }
        });

        setHandover(handover);
        setRequestBroken(requestBroken);
        setApproveBroken(approveBroken);
        setRepairBefore(requestRepair);
        setRepairAfter(approveRepair);
        setAcceptanceRepair(acceptanceRepair);
        setReHandover(reHandover);
        setRequestInspection(requestInspection);
        setApproveInspection(approveInspection);
        setRequestTransfer(requestTransfer);
        setApproveTransfer(approveTransfer);
        setRequestLiquidation(requestLiquidation);
        setApproveLiquidation(approveLiquidation);
      })
      .catch()
      .finally(() => setLoading(false))
  };

  useEffect(() => {
    getListRoleEmail();
  }, []);

  const handleChangeRole = (e: any, item: any, data: any, setData: any) => {
    const newData: any = data.map((role: any) => {
      if (role.id === item.id) {
        role.check = e.target.checked ? 1 : 0;
      }
      return role;
    });
    setData(newData);
  };

  const handleSubmitConfig = () => {
    try {
      const data = [
        ...handover,
        ...requestBroken,
        ...approveBroken,
        ...requestRepair,
        ...approveRepair,
        ...acceptanceRepair,
        ...reHandover,
        ...requestInspection,
        ...approveInspection,
        ...requestTransfer,
        ...approveTransfer,
        ...requestLiquidation,
        ...approveLiquidation,
      ].map((role: any) => ({
        role_id: role.role_id,
        check: role.check,
        action_id: role.action_id,
      }));
      setLoadingUpdate(true);
      roleApi
        .configRoleEmail(data)
        .then((res: any) => {
          const { success } = res.data;
          if (success) {
            toast.success('Cập nhật thành công!');
          } else {
            toast.error('Cập nhật thất bại!');
          }
        })
        .catch()
        .finally(() => setLoadingUpdate(false));
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div>
      <div className="title">CẤU HÌNH EMAIL</div>
      <Divider />
      <div
        className="text-red-600 flex items-center cursor-pointer text-lg gap-2 mb-6"
        onClick={() => setShowEmailConfigModal(true)}
      >
        <InfoCircleFilled />
        <div>Chi tiết cấu hình</div>
      </div>
      <div className="mb-10">
        <div className="text-lg mb-4 tex underline">1. Quy trình bàn giao</div>
        <div>
          <div className="font-medium text-base">
            Tiếp nhận phiếu bàn giao thiết bị
          </div>
          <Table
            columns={handleColumms(handover, setHandover)}
            dataSource={handover}
            className="mt-6 shadow-md"
            pagination={false}
            loading={loading}
          />
        </div>
      </div>
      <div className="mb-10">
        <div className="text-lg mb-4 tex underline">2. Quy trình báo hỏng</div>
        <div className="grid grid-cols-2 gap-20">
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu báo hỏng thiết bị(trước phê duyệt)
            </div>
            <Table
              columns={handleColumms(requestBroken, setRequestBroken)}
              dataSource={requestBroken}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu báo hỏng thiết bị(sau phê duyệt)
            </div>
            <Table
              columns={handleColumms(approveBroken, setApproveBroken)}
              dataSource={approveBroken}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <div className="mb-10">
        <div className="text-lg mb-4 tex underline">3. Quy trình sửa chữa</div>
        <div className="grid grid-cols-2 gap-20 mb-10">
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu sửa chữa thiết bị(trước phê duyệt)
            </div>
            <Table
              columns={handleColumms(requestRepair, setRepairBefore)}
              dataSource={requestRepair}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu sửa chữa thiết bị(sau phê duyệt)
            </div>
            <Table
              columns={handleColumms(approveRepair, setRepairAfter)}
              dataSource={approveRepair}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-20">
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu nghiệm thu thiết bị (sau khi hoàn tất sửa chữa)
            </div>
            <Table
              columns={handleColumms(acceptanceRepair, setAcceptanceRepair)}
              dataSource={acceptanceRepair}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu bàn giao lại thiết bị (sau khi hoàn tất sửa chữa)
            </div>
            <Table
              columns={handleColumms(reHandover, setReHandover)}
              dataSource={reHandover}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <div className="mb-10">
        <div className="text-lg mb-4 tex underline">4. Quy trình kiểm định</div>
        <div className="grid grid-cols-2 gap-20 mb-10">
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu yêu cầu kiểm định thiết bị
            </div>
            <Table
              columns={handleColumms(requestInspection, setRequestInspection)}
              dataSource={requestInspection}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu phê duyệt kiểm định thiết bị
            </div>
            <Table
              columns={handleColumms(approveInspection, setApproveInspection)}
              dataSource={approveInspection}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <div className="mb-10">
        <div className="text-lg mb-4 tex underline">
          5. Quy trình điều chuyển
        </div>
        <div className="grid grid-cols-2 gap-20 mb-10">
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu yêu cầu điều chuyển thiết bị
            </div>
            <Table
              columns={handleColumms(requestTransfer, setRequestTransfer)}
              dataSource={requestTransfer}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu phê duyệt điều chuyển thiết bị
            </div>
            <Table
              columns={handleColumms(approveTransfer, setApproveTransfer)}
              dataSource={approveTransfer}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <div className="mb-10">
        <div className="text-lg mb-4 tex underline">6. Quy trình thanh lý</div>
        <div className="grid grid-cols-2 gap-20 mb-10">
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu yêu cầu thanh lý thiết bị
            </div>
            <Table
              columns={handleColumms(requestLiquidation, setRequestLiquidation)}
              dataSource={requestLiquidation}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
          <div>
            <div className="font-medium text-base">
              Tiếp nhận phiếu phê duyệt thanh lý thiết bị
            </div>
            <Table
              columns={handleColumms(approveLiquidation, setApproveLiquidation)}
              dataSource={approveLiquidation}
              className="mt-6 shadow-md"
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button className="button-primary mt-8" onClick={handleSubmitConfig} loading={loadingUpdate}>
          Cập nhật
        </Button>
      </div>
      <Modal
        title="Cấu hình gửi tác vụ gửi mail"
        open={showEmailConfigModal}
        onCancel={() => setShowEmailConfigModal(false)}
        footer={null}
      >
        <div className="text-lg">
          - Bạn vui lòng tích vào check box những đối tượng người dùng mà bạn
          muốn gửi mail
        </div>
        <div className="text-lg">
          - Đối với mỗi tác vụ như bàn giao, điều chuyển, ... hệ thống sẽ gửi
          mail thông báo tới những đối tượng người dùng trong danh sách mà bạn
          đã cấu hình
        </div>
      </Modal>
    </div>
  );
};

export default EmailConfig;
