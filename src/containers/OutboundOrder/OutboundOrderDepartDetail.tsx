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
import outboundOrderApi from 'api/outbound_order';
import { order_status } from 'constants/dataFake.constant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const OutboundOrderDepartDetail = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = params;
  const { Column } = Table;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const handleChangePage = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
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
  const getDetailOutboundOrder = (id: any) => {
    outboundOrderApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const {
            id,
            code,
            status_id,
            customer,
            receiver,
            receiver_phone,
            estimated_shipping_date,
            department,
            note,
            actual_shipping_date,
          } = data.outbound_order;
          form.setFieldsValue({
            id,
            warehouse: data.outbound_order.Warehouse.name,
            status_id,
            code,
            customer,
            receiver,
            receiver_phone,
            department,
            note,
            estimated_shipping_date: estimated_shipping_date
              ? moment(estimated_shipping_date).format('DD/MM/YYYY')
              : '',
            actual_shipping_date: actual_shipping_date
              ? moment(actual_shipping_date).format('DD/MM/YYYY')
              : '',
          });
          setDataSource(
            data.outbound_order.Supply_Outbound_Orders.map(
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
                stock: item?.stock,
              })
            )
          );
        }
      })
      .catch();
  };

  useEffect(() => {
    getDetailOutboundOrder(id);
  }, [id]);

  const handleAccept = (id: any, type: string) => {
    outboundOrderApi
      .accept({
        data: {
          id,
          status: type,
        },
      })
      .then((res) => {
        const { message, success } = res.data;
        if (success) {
          navigate('/order/outbound_order_depart');
          toast.success('Phê duyệt thành công');
        } else {
          toast.error(message || 'Phê duyệt thất bại!');
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message || 'Phê duyệt thất bại!');
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
                Thông tin phiếu xuất nội bộ
              </Typography.Title>
              {handleOrderStatus(form.getFieldsValue()?.status_id)}
            </div>
            <Row>
              <Space>
                {form.getFieldValue('status_id') === 1 && (
                  <>
                    <Button
                      type="default"
                      className="button-primary"
                      onClick={() => handleAccept(id, 'accept')}
                    >
                      Phê duyệt
                    </Button>
                    <Button
                      className="rounded-md"
                      danger
                      onClick={() => handleAccept(id, 'reject')}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                <Button
                  type="primary"
                  className="rounded-md"
                  onClick={() => {
                    navigate('/order/outbound_order_depart');
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
                    <Form.Item label="Người nhận" name="receiver">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                    <Form.Item label="Liên hệ người nhận" name="receiver_phone">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Khoa phòng" name="department">
                      <Input className="input" type="text" disabled />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                      <TextArea rows={5} className="textarea" disabled />
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
                    label="Ngày xuất hàng dự kiến"
                    name="estimated_shipping_date"
                  >
                    <Input className="input" disabled />
                  </Form.Item>
                  <Form.Item
                    className="w-1/2"
                    label="Ngày xuất hàng thực tế"
                    name="actual_shipping_date"
                  >
                    <Input className="input" disabled />
                  </Form.Item>
                </div>
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
                    width="15%"
                    render={(value) => <p>{value}</p>}
                  />
                  <Column
                    title="Tồn kho"
                    dataIndex="stock"
                    key="stock"
                    render={(value) => {
                      return <p>{value}</p>;
                    }}
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

export default OutboundOrderDepartDetail;
