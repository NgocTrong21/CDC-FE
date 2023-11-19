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
import inboundOrderApi from 'api/inbound_order';
import supplyApi from 'api/suplly.api';
import warehouseApi from 'api/warehouse.api';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';

const InboundOrderUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = params;
  const count = useRef(1);
  const { Column } = Table;
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
        inboundOrderApi
          .update({
            data: {
              id: data.id,
              deliver: data?.deliver,
              code: data?.code,
              warehouse_id: data?.warehouse_id,
              deliver_phone: data?.deliver_phone,
              estimated_delivery_date: moment(
                new Date(data?.estimated_delivery_date)
              ).toISOString(),
              note: data?.note,
              provider: data?.provider,
            },
            supplies: dataSource?.map((item: any) => ({
              supply_id: item?.supplierId,
              quantity: parseInt(item?.orderQuantity) || 0,
            })),
          })
          .then((res) => {
            const { success, message } = res.data;
            if (success) {
              navigate('/order/inbound_order');
              toast.success('Cập nhật đơn nhập thành công');
            } else {
              toast.error(message || 'Cập nhật đơn nhập thất bại!');
            }
          })
          .catch(() => {
            toast.error('Cập nhật đơn nhập thất bại!');
          });
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
  const getSuppliesList = () => {
    supplyApi
      .list({})
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(data.supplies);
        }
      })
      .catch();
  };
  const getDetailInboundOrder = (id: any) => {
    inboundOrderApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const {
            id,
            warehouse_id,
            provider,
            code,
            deliver,
            deliver_phone,
            estimated_delivery_date,
            note,
          } = data.inbound_order;
          form.setFieldsValue({
            id,
            warehouse_id,
            provider,
            deliver,
            code,
            deliver_phone,
            note,
            estimated_delivery_date: moment(estimated_delivery_date),
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
                unit: item.Supply?.unit,
                totalValue: item.quantity * item.Supply?.unit_price || 0,
                description: item.Supply?.note,
              })
            )
          );
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
        unit: selectedItem?.unit,
      });
      setDataSource(listData);
    }
  };

  const handleChangeOrderQuantity = (
    value: number,
    index: number,
    record: any
  ) => {
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
    getDetailInboundOrder(id);
    seachWarehouses();
    getSuppliesList();
  }, [id]);

  return (
    <Layout>
      <Form form={form} size="middle" layout="vertical" autoComplete="off">
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>Cập nhật phiếu nhập</Typography.Title>
            <Row>
              <Space>
                <Button
                  type="primary"
                  className="rounded-md"
                  onClick={() => {
                    navigate('/order/inbound_order');
                  }}
                >
                  Đóng
                </Button>
                <Button
                  className="button-primary"
                  onClick={() => {
                    onFormSubmit(form.getFieldsValue());
                  }}
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
                      />
                    </Form.Item>
                    <Form.Item label="Nhà cung cấp" name="provider">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Người giao hàng" name="deliver">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item
                      label="Liên hệ người giao hàng"
                      name="deliver_phone"
                    >
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
                  label="Mã phiếu nhập"
                  name="code"
                  required
                  rules={[{ required: true, message: 'Hãy nhập mã phiếu!' }]}
                >
                  <Input className="input" />
                </Form.Item>
                <Form.Item
                  label="Ngày dự kiến nhận hàng"
                  name="estimated_delivery_date"
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
                    render={(item, record: any, index) => {
                      console.log('check item', item);

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
                    width="20%"
                    render={(value, record, index) => (
                      <InputNumber
                        style={{
                          width: '100px',
                        }}
                        onBlur={(e) => {
                          handleChangeOrderQuantity(
                            Math.round(
                              parseFloat(e.target.value.replaceAll(',', ''))
                            ) as unknown as number,
                            index,
                            record
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
                    title="Đơn giá"
                    dataIndex="unitPrice"
                    key="unitPrice"
                    render={(value, _record, index) => {
                      return (
                        <InputNumber
                          value={parseFloat(value?.toFixed(1))}
                          onChange={(value) => {}}
                          formatter={(value) =>
                            ` ${value}`
                              .replace(/\./, '.')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                          precision={1}
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

export default InboundOrderUpdate;
