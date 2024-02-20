import {
  Button,
  Col,
  Layout,
  Pagination,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import inboundOrderApi from 'api/inbound_order';
import { order_status } from 'constants/dataFake.constant';
import { permissions } from 'constants/permission.constant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser } from 'utils/globalFunc.util';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const InboundOrderDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [inboundData, setInboundData] = useState<any>({});
  const [loadingReject, setLoadingReject] = useState<boolean>(false);
  const { Column } = Table;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const handleChangePage = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  const checkPermission = (permission: number) => {
    const current_user: any = getCurrentUser();
    const permissions = current_user?.Role?.Role_Permissions;
    return permissions?.find((item: any) => item.permission_id === permission);
  };
  const dataSourceByPage = (dataSourceInput: any) => {
    if (dataSourceInput && dataSourceInput?.length > 0) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return dataSourceInput.slice(startIndex, endIndex);
    } else {
      return [];
    }
  };
  const getDetailInboundOrder = (id: any) => {
    inboundOrderApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const {
            id,
            code,
            status_id,
            provider,
            deliver,
            deliver_phone,
            estimated_delivery_date,
            receive_date,
            note,
          } = data.inbound_order;
          setInboundData({
            id,
            warehouse: data.inbound_order.Warehouse.name,
            status_id,
            code,
            provider,
            deliver,
            deliver_phone,
            note,
            estimated_delivery_date: estimated_delivery_date
              ? moment(estimated_delivery_date).format('DD/MM/YYYY')
              : '',
            receive_date: receive_date
              ? moment(receive_date).format('DD/MM/YYYY')
              : '',
          });
          setDataSource(
            data.inbound_order.Supply_Inbound_Orders.map(
              (item: any, index: any) => ({
                key: index,
                supplierId: item.Supply?.id,
                supplierCode: item.Supply?.code || '',
                supplierName: item.Supply?.name,
                lot_number: item.Supply?.lot_number,
                orderQuantity: item.quantity,
                unitPrice: item.Supply?.unit_price,
                unit: item.Supply?.Equipment_Unit?.name,
                totalValue: item.quantity * item.Supply?.unit_price || 0,
                description: item.Supply?.note,
              })
            )
          );
        }
      })
      .catch();
  };

  useEffect(() => {
    getDetailInboundOrder(id);
  }, [id]);

  const handleAccept = (id: any, type: string) => {
    if (type === 'accept') {
      setLoading(true);
    } else {
      setLoadingReject(true);
    }
    inboundOrderApi
      .accept({
        data: {
          id,
          status: type,
        },
      })
      .then(() => {
        setLoading(false);
        toast.success('Phê duyệt thành công');
        navigate('/order/inbound_order');
      })
      .catch(() => {
        setLoading(false);
        toast.error('Phê duyệt thất bại!');
      });
  };
  const handleOrderStatus = (status: any = 0) => {
    let color: any;
    if (status === 1) color = 'text-orange-400';
    if (status === 2) color = 'text-green-500';
    if (status === 3) color = 'text-red-500';
    return (
      <span className={`${color} text-lg pb-2`}>
        {order_status.filter((item: any) => item.value === status)[0]?.label}
      </span>
    );
  };
  return (
    <Layout className="bg-white">
      <Row align="middle" justify="space-between">
        <div className="flex gap-5 items-center">
          <Typography.Title level={4}>Thông tin phiếu nhập</Typography.Title>
          {handleOrderStatus(inboundData?.status_id)}
        </div>
        <Row>
          <Space>
            {checkPermission(permissions.APPROVE_ORDERS) &&
              inboundData?.status_id === 1 && (
                <>
                  <Button
                    type="default"
                    className="button-primary"
                    onClick={() => handleAccept(id, 'accept')}
                    loading={loading}
                  >
                    Phê duyệt
                  </Button>
                  <Button
                    className="rounded-md"
                    danger
                    onClick={() => handleAccept(id, 'reject')}
                    loading={loadingReject}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            <Button
              type="primary"
              className="rounded-md"
              onClick={() => {
                navigate('/order/inbound_order');
              }}
            >
              Đóng
            </Button>
          </Space>
        </Row>
      </Row>
      <Layout className="bg-white">
        <Row justify="space-between" className="my-6">
          <Col span={24}>
            <Row justify="space-between">
              <Col span={11}>
                <Row>
                  <Typography.Title level={5}>Thông tin chung</Typography.Title>
                </Row>
                <Row gutter={[0, 15]}>
                  <Col span={8}>Kho hàng</Col>
                  <Col span={16}>{`${inboundData?.warehouse}` || ''}</Col>
                  <Col span={8}>Người giao hàng</Col>
                  <Col span={16}>{inboundData?.deliver || ''}</Col>
                  <Col span={8}>Liên hệ người giao hàng</Col>
                  <Col span={16}>{inboundData?.deliver_phone || ''}</Col>
                  <Col span={8}>Ghi chú</Col>
                  <Col span={16}>{inboundData?.note || ''}</Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Typography.Title level={5}>Tài liệu</Typography.Title>
                </Row>
                <Row gutter={[0, 15]}>
                  <Col span={8}>Số phiếu nhập</Col>
                  <Col span={16}>{`${inboundData?.code}` || ''}</Col>
                  <Col span={8}>Ngày nhận hàng dự kiến</Col>
                  <Col span={16}>
                    {inboundData?.estimated_delivery_date || ''}
                  </Col>
                  <Col span={8}>Ngày nhận hàng thực tế</Col>
                  <Col span={16}>{inboundData?.receive_date || ''}</Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Layout className="bg-white">
          <Row justify="space-between" className="mb-5">
            <Typography.Title level={5}>Danh sách vật tư</Typography.Title>
          </Row>
          <Row>
            <Table
              size="large"
              className="w-full"
              dataSource={dataSourceByPage(dataSource)}
              pagination={false}
            >
              <Column
                title="Mã vật tư"
                dataIndex={'supplierCode'}
                key={'supplierCode'}
              />
              <Column
                title="Số lô"
                dataIndex={'lot_number'}
                key={'lot_number'}
              />
              <Column title="Tên vật tư" render={(item) => item.supplierName} />
              <Column title="Đơn vị" dataIndex={'unit'} key={'unit'} />
              <Column
                title="Số lượng đặt hàng"
                dataIndex={'orderQuantity'}
                key={'orderQuantity'}
                render={(value) => <p>{value}</p>}
              />
              <Column
                title="Đơn giá"
                dataIndex="unitPrice"
                key="unitPrice"
                width="15%"
                render={(value) => {
                  return <p>{formatCurrencyVN(value)}</p>;
                }}
              />
              <Column
                title="Tổng giá trị"
                dataIndex={'totalValue'}
                key={'totalValue'}
                width="15%"
                render={(value) => <p>{formatCurrencyVN(value)}</p>}
              />
              <Column
                title="Ghi chú"
                dataIndex={'description'}
                key={'description'}
              />
            </Table>
            <Row className="w-full mt-5" justify={'end'}>
              {dataSource && (
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={dataSource.length}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]}  ${total} items`
                  }
                  onChange={handleChangePage}
                  onShowSizeChange={handleChangePage}
                  showSizeChanger={true}
                />
              )}
            </Row>
          </Row>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default InboundOrderDetail;
