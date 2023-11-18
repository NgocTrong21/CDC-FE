import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import outboundOrderApi from 'api/outbound_order';
import supplyApi from 'api/suplly.api';
import warehouseApi from 'api/warehouse.api';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useRoutes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';

const OutboundOrderDetail = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = params;
  const count = useRef(1);
  const { Column } = Table;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [supllies, setSupplies] = useState<any>([]);
  const [warehouses, setWarehouses] = useState([]);
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
  const searchWarehouses = () => {
    warehouseApi.search({
    })
      .then((res) => {
        const { success, data } = res.data;
        if (success) {
          setWarehouses(data.warehouses);
        }
      })
      .catch()
  }
  const getDetailOutboundOrder = (id: any) => {
    outboundOrderApi.detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const { id, warehouse_id, code, status_id, customer, receiver, receiver_phone, estimated_shipping_date, note } = data.outbound_order;
          form.setFieldsValue({
            id, warehouse_id, status_id, code, customer, receiver, receiver_phone, note, estimated_shipping_date: moment(estimated_shipping_date).format('DD/MM/YYYY'),
          });
          setDataSource(data.outbound_order.Supply_Outbound_Orders.map((item: any, index: any) => ({
            key: index,
            supplierId: item.Supply?.id,
            supplierCode: item.Supply?.code || '',
            supplierName: item.Supply?.name,
            orderQuantity: item.quantity,
            unitPrice: item.Supply?.unit_price,
            unit: item.Supply?.unit,
            totalValue: item.quantity * item.Supply?.unit_price || 0,
            description: item.Supply?.note,
          })));
        }
      })
      .catch()
  }


  useEffect(() => {
    getDetailOutboundOrder(id);
    searchWarehouses();
  }, [id]);

  const handleAccept = (id: any, type: string) => {
    outboundOrderApi.accept({
      data: {
        id,
        status: type,
      }
    }).then(() => {
      toast.success('Phê duyệt thành công');
    }).catch(() => {
      toast.error('Phê duyệt thất bại!');
    });
  }
  return (
    <Layout>
      <Form form={form} size="middle" layout="vertical" autoComplete="off" >
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>Thông tin phiếu xuất</Typography.Title>
            <Row>
              <Space>
                {form.getFieldValue('status_id') === 1 && <><Button type="default" className="button-primary" onClick={() => handleAccept(id, 'accept')}>
                  Phê duyệt
                </Button>
                  <Button className="rounded-md" danger onClick={() => handleAccept(id, 'reject')}>
                    Từ chối
                  </Button></>}
                <Button type="primary" className="rounded-md" onClick={() => {
                  navigate('/order/outbound_order')
                }}>
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
                    <Form.Item
                      className='hidden'
                      name="id"
                    >
                      <Input type='text' disabled />
                    </Form.Item>
                    <Form.Item
                      className='hidden'
                      name="status_id"
                    >
                      <Input type='text' disabled />
                    </Form.Item>
                    <Form.Item
                      label="Kho hàng"
                      name="warehouse_id"
                      required
                      rules={[{ required: true, message: 'Hãy chọn kho!' }]}
                    >
                      <Select
                        placeholder="Kho hàng"
                        options={options(warehouses)}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label="Khách hàng" name="customer">
                      <Input className="input" type='text' disabled />
                    </Form.Item>
                    <Form.Item label="Người nhận" name="receiver">
                      <Input className="input" type='text' disabled />
                    </Form.Item>
                    <Form.Item label="Liên hệ người nhận" name="receiver_phone">
                      <Input className="input" type='text' disabled />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Vị trí kho hàng">
                      <Input className="input" type='text' disabled />
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
                  <Input className="input" type='text' disabled />
                </Form.Item>
                <Form.Item label="Ngày dự kiến nhận hàng" name="estimated_shipping_date">
                  <Input className="input" disabled />
                </Form.Item>
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
                    render={(value) => (
                      <InputNumber
                        disabled
                        style={{
                          width: '100px',
                        }}
                        formatter={(value) => {
                          return `${value}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                          );
                        }}
                        value={value}
                        precision={0}
                        className='text-black'
                      />
                    )}
                  />
                  <Column
                    title="Đơn giá"
                    dataIndex="unitPrice"
                    key="unitPrice"
                    render={(value, _record) => {
                      return (
                        <InputNumber
                          disabled
                          value={parseFloat(value?.toFixed(1))}
                          formatter={(value) =>
                            ` ${value}`
                              .replace(/\./, '.')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                          precision={1}
                          className='text-black'
                        />
                      );
                    }}
                  />
                  <Column
                    title="Tổng giá trị"
                    dataIndex={'totalValue'}
                    key={'totalValue'}
                    render={(value) => (
                      <InputNumber
                        value={parseFloat(value?.toFixed(1))}
                        formatter={(value) =>
                          ` ${value}`
                            .replace(/\./, '.')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        precision={1}
                        disabled
                        className='text-black'
                      />
                    )}
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

export default OutboundOrderDetail;