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
import outboundOrderApi from 'api/outbound_order';
import { order_status } from 'constants/dataFake.constant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const OutboundOrderDetail = () => {
  const [outboundData, setOutboundData] = useState<any>({});
  const params = useParams();
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
            handover_date,
            actual_shipping_date,
            note,
          } = data.outbound_order;
          setOutboundData({
            id,
            warehouse: data.outbound_order.Warehouse.name,
            status_id,
            code,
            customer,
            receiver,
            receiver_phone,
            note,
            estimated_shipping_date: estimated_shipping_date
              ? moment(estimated_shipping_date).format('DD/MM/YYYY')
              : '',
            actual_shipping_date: actual_shipping_date
              ? moment(actual_shipping_date).format('DD/MM/YYYY')
              : '',
            handover_date: handover_date
              ? moment(handover_date).format('DD/MM/YYYY')
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
          navigate('/order/outbound_order');
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
    <Layout className="bg-white">
      <Row align="middle" justify="space-between">
        <div className="flex gap-5 items-center">
          <Typography.Title level={4}>
            Thông tin phiếu xuất bệnh viện
          </Typography.Title>
          {handleOrderStatus(outboundData?.status_id)}
        </div>
        <Row>
          <Space>
            {outboundData?.status_id === 1 && (
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
                navigate('/order/outbound_order');
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
                  <Col span={16}>{`${outboundData?.warehouse}` || ''}</Col>
                  <Col span={8}>Người nhận</Col>
                  <Col span={16}>{outboundData?.receiver || ''}</Col>
                  <Col span={8}>Liên hệ người nhận</Col>
                  <Col span={16}>{outboundData?.receiver_phone || ''}</Col>
                  <Col span={8}>Ghi chú</Col>
                  <Col span={16}>{outboundData?.note || ''}</Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Typography.Title level={5}>Tài liệu</Typography.Title>
                </Row>
                <Row gutter={[0, 15]}>
                  <Col span={8}>Số phiếu xuất</Col>
                  <Col span={16}>{`${outboundData?.code}` || ''}</Col>
                  <Col span={8}>Ngày xuất hàng dự kiến</Col>
                  <Col span={16}>
                    {outboundData?.estimated_shipping_date || ''}
                  </Col>
                  <Col span={8}>Ngày xuất hàng thực tế</Col>
                  <Col span={16}>
                    {outboundData?.actual_shipping_date || ''}
                  </Col>
                  <Col span={8}>Ngày bàn giao</Col>
                  <Col span={16}>{outboundData?.handover_date || ''}</Col>
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
              <Column title="Tên vật tư" render={(item) => item.supplierName} />
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
  );
};

export default OutboundOrderDetail;
