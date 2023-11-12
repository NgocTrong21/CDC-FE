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
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';

const InboundOrderCreate = () => {
  const count = useRef(1);
  const [form] = Form.useForm();
  const { Column } = Table;
  const [dataSource, setDataSource] = useState<any>([{
    key: count.current,
    supplierCode: '',
    supplierName: '',
    orderQuantity: 0,
    unitPrice: 0,
    totalValue: 0,
    description: '',
  }]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [warehouses, setWarehouses] = useState([]);
  const [supllies, setSupplies] = useState<any>([]);

  const seachWarehouses = (params: any) => {
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
  const getSuppliesList = () => {
    supplyApi
      .list({})
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(data.supplies);
        }
      })
      .catch()
  };
  useEffect(() => {
    getSuppliesList();
    seachWarehouses({});
  }, [])

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
        copyData.filter((item: any) => !selectedItems.includes(item?.key as number))
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
        unit: selectedItem?.unit
      })

      setDataSource(listData)
    }
  }

  const handleChangeOrderQuantity = (value: number, index: number, record: any) => {
    const actualIndex = (currentPage - 1) * pageSize + index;
    const listData = [...dataSource];
    const orderQuantity = value || 0;
    const unitValue = listData[actualIndex]?.unitPrice as number;
    const totalValue = (orderQuantity * unitValue) || 0;
    listData[actualIndex] = {
      ...listData[actualIndex],
      orderQuantity,
      totalValue: totalValue || 0,
    };
    setDataSource(listData);
  }
  const onFormSubmit = async (data: any) => {
    if (data) {
      inboundOrderApi.create({
        data: {
          code: data?.code,
          deliver: data?.deliver,
          deliver_phone: data?.deliver_phone,
          warehouse_id: data?.warehouse_id,
          estimated_delivery_date: moment(new Date(data?.estimated_delivery_date)).toISOString(),
          note: data?.note,
          provider: data?.provider,
        },
        supplies: dataSource?.map((item: any) => ({
          supply_id: item?.id,
          quantity: parseInt(item?.orderQuantity) || 0,
        })),
      }).then(() => {
        navigate('/order/inbound_order')
        toast.success('Tạo đơn nhập thành công');
      }).catch(() => {
        toast.error('Tạo đơn nhập thất bại!');
      });
    }
  };
  return (
    <Layout>
      <Form size="middle" layout="vertical" autoComplete="off" form={form}>
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>Tạo phiếu nhập</Typography.Title>
            <Row>
              <Space>
                <Button type="primary" className="rounded-md" htmlType="submit">
                  Đóng
                </Button>
                <Button className="button-primary" htmlType="submit" onClick={() => {
                  onFormSubmit(form.getFieldsValue())
                }}>
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
                      />
                    </Form.Item>
                    <Form.Item label="Nhà cung cấp" name="provider">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Người giao hàng" name="deliver">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Liên hệ người giao hàng" name="deliver_phone">
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
                <Form.Item label="Số phiếu nhập" name="code">
                  <Input className="input" />
                </Form.Item>
                <Form.Item label="Ngày dự kiến nhận hàng" name="estimated_delivery_date">
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
                    width="20%"

                    render={(value, record, index) => (
                      <InputNumber
                        style={{
                          width: '100px',
                        }}
                        onBlur={(e) => {
                          handleChangeOrderQuantity(Math.round(parseFloat((e.target.value).replaceAll(',', ''))) as unknown as number, index, record)
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
                          onChange={(value) => { }}
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

export default InboundOrderCreate;
