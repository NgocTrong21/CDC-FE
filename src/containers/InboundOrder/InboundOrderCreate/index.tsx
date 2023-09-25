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
import { useRef, useState } from 'react';

const mockDataSuppliers = [
  {
    key: 1,
    supplierCode: 'code',
    supplierName: 'name',
    orderQuantity: 10,
    unitPrice: 10,
    totalValue: 20000,
    description: 'note',
  },
  {
    key: 2,
    supplierCode: 'code',
    supplierName: 'name',
    orderQuantity: 10,
    unitPrice: 10,
    totalValue: 20000,
    description: 'note',
  },
  {
    key: 3,
    supplierCode: 'code',
    supplierName: 'name',
    orderQuantity: 10,
    unitPrice: 10,
    totalValue: 20000,
    description: 'note',
  },
];

const InboundOrderCreate = () => {
  const count = useRef(3);
  const { Column } = Table;
  const [dataSource, setDataSource] = useState(mockDataSuppliers);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
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
  return (
    <Layout>
      <Form size="middle" layout="vertical" autoComplete="off">
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>Tạo phiếu nhập</Typography.Title>
            <Row>
              <Space>
                <Button type="primary" className="rounded-md" htmlType="submit">
                  Đóng
                </Button>
                <Button className="button-primary" htmlType="submit">
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
                    <Form.Item label="Kho hàng">
                      <Select />
                    </Form.Item>
                    <Form.Item label="Nhà cung cấp">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Người giao hàng">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Liên hệ người giao hàng">
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Vị trí kho hàng">
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item label="Ghi chú">
                      <TextArea rows={9} className="textarea" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Typography.Title level={5}>Tài liệu</Typography.Title>
                </Row>
                <Form.Item label="Số phiếu nhập">
                  <Input className="input" />
                </Form.Item>
                <Form.Item label="Ngày dự kiến nhận hàng">
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
                        onBlur={(e) => {}}
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

export default InboundOrderCreate;
