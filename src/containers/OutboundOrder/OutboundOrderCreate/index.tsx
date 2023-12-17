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
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';
import { formatCurrencyVN } from 'utils/validateFunc.util';

const OutboundOrderCreate = () => {
  const count = useRef(1);
  const [form] = Form.useForm();
  const { Column } = Table;
  const [dataSource, setDataSource] = useState<any>([
    {
      key: count.current,
      supplierCode: '',
      supplierName: '',
      orderQuantity: 0,
      unitPrice: 0,
      stock: 0,
      totalValue: 0,
      description: '',
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [warehouses, setWarehouses] = useState([]);
  const [supllies, setSupplies] = useState<any>([]);
  const navigate = useNavigate();
  const seachWarehouses = (params: any) => {
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
  useEffect(() => {
    seachWarehouses({});
  }, []);

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
        copyData.filter(
          (item: any) => !selectedItems.includes(item?.key as number)
        )
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
  const handleSelectItem = (value: string, index: number, record: any) => {
    if (supllies && supllies?.length > 0) {
      const actualIndex = (currentPage - 1) * pageSize + index;
      let listData = [...dataSource];
      const selectedItem = supllies?.find((item: any) => item?.id === value);
      listData.splice(actualIndex, 1, {
        ...record,
        id: selectedItem?.id,
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
  const handleSetSupplies = (warehouseId: number) => {
    warehouseApi
      .suppliesByWarehouse(warehouseId)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const dataSupplies = data.supplies
            .filter((item: any) => item.quantity > 0)
            .map((item: any) => ({ ...item.Supply, quantity: item.quantity }));
          setSupplies(dataSupplies);
        }
      })
      .catch();
  };
  const handleChangeOrderQuantity = (value: number, index: number) => {
    const actualIndex = (currentPage - 1) * pageSize + index;
    const listData = [...dataSource];
    let orderQuantity;
    if (value > 0) {
      orderQuantity = value;
    } else {
      orderQuantity = 1;
    }
    const unitValue = listData[actualIndex]?.unitPrice as number;
    const totalValue = orderQuantity * unitValue || 0;
    listData[actualIndex] = {
      ...listData[actualIndex],
      orderQuantity,
      totalValue: totalValue || 0,
    };
    setDataSource(listData);
  };
  const onFormSubmit = async (data: any) => {
    try {
      await form.validateFields();
      if (data) {
        setLoading(true);
        outboundOrderApi
          .create({
            data: {
              receiver: data?.receiver,
              receiver_phone: data?.receiver_phone,
              code: data?.code,
              warehouse_id: data?.warehouse_id,
              estimated_shipping_date: moment(
                new Date(data?.estimated_shipping_date)
              ).toISOString(),
              note: data?.note,
              customer: data?.customer,
            },
            supplies: dataSource?.map((item: any) => ({
              supply_id: item?.id,
              quantity: parseInt(item?.orderQuantity) || 1,
            })),
          })
          .then((res) => {
            const { message, success } = res.data;
            if (success) {
              navigate('/order/outbound_order');
              toast.success('Tạo phiếu xuất thành công');
            } else {
              toast.error(message || 'Tạo phiếu xuất thất bại');
            }
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          })
          .finally(() => setLoading(false));
      }
    } catch (error) {}
  };
  return (
    <Layout>
      <Form size="middle" layout="vertical" autoComplete="off" form={form}>
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>Tạo phiếu xuất</Typography.Title>
            <Row>
              <Space>
                <Button type="primary" className="rounded-md">
                  Đóng
                </Button>
                <Button
                  className="button-primary"
                  htmlType="submit"
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
                    <Form.Item
                      label="Kho hàng"
                      name="warehouse_id"
                      required
                      rules={[{ required: true, message: 'Hãy chọn kho!' }]}
                    >
                      <Select
                        placeholder="Kho hàng"
                        options={options(warehouses)}
                        onSelect={handleSetSupplies}
                      />
                    </Form.Item>
                    <Form.Item label="Khách hàng" name="customer">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Người nhận" name="receiver">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Liên hệ người nhận" name="receiver_phone">
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Vị trí kho hàng">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                      <TextArea rows={9} className="textarea" />
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
                <Form.Item
                  label="Ngày dự kiến xuất hàng"
                  name="estimated_shipping_date"
                >
                  <DatePicker className="date" />
                </Form.Item>
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
                    dataIndex={'supplierName'}
                    key={'supplierName'}
                    render={(_item, record: any, index) => {
                      return (
                        <Form.Item
                          style={{
                            margin: 'auto',
                          }}
                          name={`supplierName${record?.key}`}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              ((option?.label ?? '') as string)
                                .toLowerCase()
                                .includes(input.trim().toLowerCase())
                            }
                            style={{ width: '100%' }}
                            options={options(supllies)}
                            onChange={(value) => {
                              handleSelectItem(value, index, record);
                            }}
                          />
                        </Form.Item>
                      );
                    }}
                  />
                  <Column title="Đơn vị" dataIndex={'unit'} key={'unit'} />
                  <Column
                    title="Số lượng đặt hàng"
                    dataIndex={'orderQuantity'}
                    key={'orderQuantity'}
                    width="15%"
                    render={(value, _record, index) => (
                      <InputNumber
                        className="w-full"
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
                    render={(value, _record) => {
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

export default OutboundOrderCreate;
