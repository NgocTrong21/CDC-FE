import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Pagination,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
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
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = params;
  const [loading, setLoading] = useState<boolean>(false);
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
          form.setFieldsValue({
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
    <Layout>
      <Form form={form} size="middle" layout="vertical" autoComplete="off">
        <Layout>
          <Row align="middle" justify="space-between">
            <div className="flex gap-5 items-center">
              <Typography.Title level={4}>
                Thông tin phiếu nhập
              </Typography.Title>
              {handleOrderStatus(form.getFieldsValue()?.status_id)}
            </div>
            <Row>
              <Space>
                {checkPermission(permissions.APPROVE_ORDERS) &&
                  form.getFieldValue('status_id') === 1 && (
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
          <Layout>
            <Row justify="space-between">
              <Col span={15}>
                <Row>
                  <Typography.Title level={5}>Thông tin chung</Typography.Title>
                </Row>
                <Row justify="space-between">
                  <Col span={12}>
                    <Form.Item className="hidden" name="id">
                      <Input type="text" disabled />
                    </Form.Item>
                    <Form.Item className="hidden" name="status_id">
                      <Input type="text" disabled />
                    </Form.Item>
                    <Form.Item label="Kho hàng" name="warehouse">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                    <Form.Item label="Nhà cung cấp" name="provider">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                    <Form.Item label="Người giao hàng" name="deliver">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                    <Form.Item
                      label="Liên hệ người giao hàng"
                      name="deliver_phone"
                    >
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Vị trí kho hàng">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                      <TextArea rows={9} className="textarea" disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Typography.Title level={5}>Tài liệu</Typography.Title>
                </Row>
                <Form.Item label="Số phiếu nhập" name="code">
                  <Input className="input" type="text" disabled />
                </Form.Item>
                <div className="flex gap-5 justify-between">
                  <Form.Item
                    className="w-1/2"
                    label="Ngày nhận hàng dự kiến"
                    name="estimated_delivery_date"
                  >
                    <Input className="input" type="text" disabled />
                  </Form.Item>
                  <Form.Item
                    className="w-1/2"
                    label="Ngày nhận hàng thực tế"
                    name="receive_date"
                  >
                    <Input className="input" type="text" disabled />
                  </Form.Item>
                </div>
                {/* <Form.Item
                  label="Ngày dự kiến nhận hàng"
                  name="estimated_delivery_date"
                >
                  <Input className="input" disabled />
                </Form.Item> */}
              </Col>
            </Row>
            <Layout>
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
                    title="Tên vật tư"
                    render={(item) => item.supplierName}
                  />
                  <Column title="Đơn vị" dataIndex={'unit'} key={'unit'} />
                  <Column
                    title="Số lượng đặt hàng"
                    dataIndex={'orderQuantity'}
                    key={'orderQuantity'}
                    width="20%"
                    render={(value) => <p>{value}</p>}
                  />
                  <Column
                    title="Đơn giá"
                    dataIndex="unitPrice"
                    key="unitPrice"
                    render={(value) => {
                      return <p>{formatCurrencyVN(value)}</p>;
                    }}
                  />
                  <Column
                    title="Tổng giá trị"
                    dataIndex={'totalValue'}
                    key={'totalValue'}
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
      </Form>
    </Layout>
  );
};

export default InboundOrderDetail;
