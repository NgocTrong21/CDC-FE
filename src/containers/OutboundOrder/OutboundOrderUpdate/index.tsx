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
import warehouseApi from 'api/warehouse.api';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const OutboundOrderUpdate = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const { id } = params;
  const count = useRef(1);
  const { Column } = Table;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [supllies, setSupplies] = useState<any>([]);
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const addRow = () => {
    count.current++;
    const defaultValue = {
      key: count.current,
      supplierCode: '',
      supplierName: '',
      orderQuantity: 0,
      unitPrice: 0,
      totalValue: 0,
      description: '',
      stock: 0,
    };
    setDataSource([...dataSource, defaultValue]);
  };
  const handleDelete = () => {
    if (dataSource?.length > 0 && selectedItems?.length > 0) {
      let copyData = dataSource;
      setDataSource(
        copyData.filter((item) => !selectedItems.includes(item?.key as number))
      );
      setCurrentPage(1);
      setSelectedItems([]);
    }
  };
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
  const onFormSubmit = async (data: any) => {
    try {
      await form.validateFields();
      if (data) {
        setLoading(true);
        outboundOrderApi
          .update({
            data: {
              id: data.id,
              receiver: data?.receiver,
              receiver_phone: data?.receiver_phone,
              code: data?.code,
              warehouse_id: data?.warehouse_id,
              estimated_shipping_date: data?.estimated_shipping_date
                ? moment(new Date(data?.estimated_shipping_date)).toISOString()
                : '',
              actual_shipping_date: data?.actual_shipping_date
                ? moment(new Date(data?.actual_shipping_date)).toISOString()
                : '',
              handover_date: data?.handover_date
                ? moment(new Date(data?.handover_date)).toISOString()
                : '',
              note: data?.note,
              customer: data?.customer,
            },
            supplies: dataSource?.map((item: any) => ({
              supply_id: item?.supplierId,
              quantity: parseInt(item?.orderQuantity) || 0,
            })),
          })
          .then((res) => {
            const { message, success } = res.data;
            if (success) {
              toast.success('Cập nhật phiếu nhập thành công');
            } else {
              toast.error(message || 'Cập nhật phiếu nhập thất bại!');
            }
          })
          .catch((error) => {
            if (error?.response?.data?.message) {
              toast.error(error?.response?.data?.message);
            } else {
              toast.error('Cập nhật phiếu nhập thất bại!');
            }
          })
          .finally(() => setLoading(false));
      }
    } catch (error) {}
  };
  const seachWarehouses = () => {
    warehouseApi
      .search({})
      .then((res) => {
        const { success, data } = res.data;
        if (success) {
          setWarehouses(data.warehouses);
        }
      })
      .catch();
  };
  const getDetailOutboundOrder = (id: any) => {
    outboundOrderApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const {
            id,
            warehouse_id,
            customer,
            code,
            receiver,
            receiver_phone,
            estimated_shipping_date,
            note,
            handover_date,
            actual_shipping_date,
          } = data.outbound_order;
          form.setFieldsValue({
            id,
            warehouse_id,
            customer,
            receiver,
            code,
            receiver_phone,
            note,
            estimated_shipping_date: moment(estimated_shipping_date),
            actual_shipping_date: moment(actual_shipping_date),
            handover_date: moment(handover_date),
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
          handleSetSupplies(warehouse_id);
        }
      })
      .catch();
  };
  const handleSelectItem = (value: string, index: number, record: any) => {
    if (supllies && supllies?.length > 0) {
      const actualIndex = (currentPage - 1) * pageSize + index;
      let listData = [...dataSource];
      const selectedItem = supllies?.find((item: any) => item?.id === value);
      listData.splice(actualIndex, 1, {
        ...record,
        supplierId: selectedItem?.id,
        supplierCode: selectedItem?.code,
        supplierName: selectedItem?.name,
        unitPrice: selectedItem?.unit_price,
        description: selectedItem?.note,
        unit: selectedItem?.Equipment_Unit?.name,
        stock: selectedItem?.quantity,
      });
      setDataSource(listData);
    }
  };

  const handleChangeOrderQuantity = (value: number, index: number) => {
    const actualIndex = (currentPage - 1) * pageSize + index;
    const listData = [...dataSource];
    const orderQuantity = value || 0;
    const unitValue = listData[actualIndex]?.unitPrice as number;
    const totalValue = orderQuantity * unitValue || 0;
    listData[actualIndex] = {
      ...listData[actualIndex],
      orderQuantity,
      totalValue: totalValue || 0,
    };
    setDataSource(listData);
  };
  useEffect(() => {
    getDetailOutboundOrder(id);
    seachWarehouses();
  }, [id]);
  const handleSetSupplies = (warehouseId: number) => {
    warehouseApi
      .suppliesByWarehouse(warehouseId)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const dataSupplies = data.supplies.map((item: any) => ({
            ...item.Supply,
            quantity: item.quantity,
          }));
          setSupplies(dataSupplies);
        }
      })
      .catch();
  };
  return (
    <Layout>
      <Form size="middle" layout="vertical" autoComplete="off" form={form}>
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>
              Cập nhật phiếu xuất bệnh viện
            </Typography.Title>
            <Row>
              <Space>
                <Button type="primary" className="rounded-md">
                  Đóng
                </Button>
                <Button
                  className="button-primary"
                  onClick={() => {
                    onFormSubmit(form.getFieldsValue());
                  }}
                  loading={loading}
                >
                  Lưu
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
                      <Input />
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
                        onChange={handleSetSupplies}
                      />
                    </Form.Item>
                    <Form.Item label="Người nhận" name="receiver">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Liên hệ người nhận" name="receiver_phone">
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Khách hàng" name="customer">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                      <TextArea rows={5} className="textarea" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Typography.Title level={5}>Tài liệu</Typography.Title>
                </Row>
                <Form.Item
                  label="Mã phiếu xuất"
                  name="code"
                  required
                  rules={[{ required: true, message: 'Hãy nhập mã phiếu!' }]}
                >
                  <Input className="input" />
                </Form.Item>
                <div className="flex gap-5 justify-between">
                  <Form.Item
                    className="w-1/3"
                    label="Ngày xuất hàng dự kiến"
                    name="estimated_shipping_date"
                  >
                    <DatePicker className="date" />
                  </Form.Item>
                  <Form.Item
                    className="w-1/3"
                    label="Ngày xuất hàng thực tế"
                    name="actual_shipping_date"
                  >
                    <DatePicker className="date" />
                  </Form.Item>
                  <Form.Item
                    className="w-1/3"
                    label="Ngày bàn giao"
                    name="handover_date"
                  >
                    <DatePicker className="date" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Layout>
              <Row justify="space-between" className="mb-5">
                <Typography.Title level={5}>Danh sách vật tư</Typography.Title>
                <Space>
                  {selectedItems?.length > 0 && (
                    <Button
                      className="rounded-md"
                      danger
                      onClick={handleDelete}
                    >
                      Xóa
                    </Button>
                  )}

                  <Button className="button-primary" onClick={addRow}>
                    Thêm
                  </Button>
                </Space>
              </Row>
              <Row>
                <Table
                  size="large"
                  className="w-full"
                  dataSource={dataSourceByPage(dataSource)}
                  rowSelection={{
                    selectedRowKeys: selectedItems,
                    hideSelectAll: true,
                    onSelect: (record, selected) => {
                      if (selected) {
                        setSelectedItems([
                          ...selectedItems,
                          record?.key as number,
                        ]);
                      } else {
                        const newData = selectedItems.filter(
                          (item: number) => item !== record?.key
                        );
                        setSelectedItems([...newData]);
                      }
                    },
                  }}
                  pagination={false}
                >
                  <Column
                    title="Mã vật tư"
                    dataIndex={'supplierCode'}
                    key={'supplierCode'}
                  />
                  <Column
                    title="Tên vật tư"
                    render={(item, record: any, index) => {
                      return (
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            ((option?.label ?? '') as string)
                              .toLowerCase()
                              .includes(input.trim().toLowerCase())
                          }
                          options={options(supllies)}
                          style={{ width: '100%' }}
                          onChange={(value) => {
                            handleSelectItem(value, index, record);
                          }}
                          value={item.supplierName}
                        />
                      );
                    }}
                  />
                  <Column title="Đơn vị" dataIndex={'unit'} key={'unit'} />
                  <Column
                    title="Số lượng đặt hàng"
                    dataIndex={'orderQuantity'}
                    key={'orderQuantity'}
                    width="15%"
                    render={(value, record, index) => (
                      <InputNumber
                        className="w-full"
                        min={1}
                        onBlur={(e) => {
                          handleChangeOrderQuantity(
                            Math.round(
                              parseFloat(e.target.value.replaceAll(',', ''))
                            ) as unknown as number,
                            index
                          );
                        }}
                        formatter={(value) => {
                          return `${value}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                          );
                        }}
                        value={value}
                        precision={0}
                      />
                    )}
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

export default OutboundOrderUpdate;
