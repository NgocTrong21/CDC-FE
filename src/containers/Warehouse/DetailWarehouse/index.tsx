import { Divider, Pagination, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import warehouseApi from 'api/warehouse.api';
import image from 'assets/image.png';
import { formatCurrencyVN } from 'utils/validateFunc.util';
const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};
const DetailWarehouse = () => {
  const { id } = useParams();
  const [detailWarehouse, setDetailWarehouse] = useState<any>('');
  const [supplies, setSupplies] = useState<any>();
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (id) {
      warehouseApi
        .detail(+id)
        .then((res: any) => {
          const { success, data } = res.data;
          if (success) {
            const { name, code, note, storekeeper, id, Warehouse_Supplies } = data.warehouse;
            setDetailWarehouse({
              id,
              name,
              code,
              storekeeper,
              note,
            });
            setSupplies(Warehouse_Supplies)
            setTotal(Warehouse_Supplies.length)
          }
        })
        .catch();
    }
  }, [id]);
  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      show: true,
      render(item: any) {
        return (
          <img src={item?.Supply?.image || image} alt="logo" className='w-full  aspect-square object-contain' />
        );
      },
      width: 120,
    },
    {
      title: 'Mã vật tư',
      key: 'code',
      show: true,
      widthExcel: 15,
      width: 150,
      render(item: any) {
        return (
          <p>{item?.Supply?.code}</p>
        );
      },
    },
    {
      title: 'Số lô',
      key: 'lot_number',
      show: true,
      widthExcel: 15,
      width: 150,
      render(item: any) {
        return (
          <p>{item?.Supply?.lot_number}</p>
        );
      },
    },
    {
      title: 'Tên vật tư',
      key: 'name',
      show: true,
      widthExcel: 30,
      width: 200,
      render(item: any) {
        return (
          <p>{item?.Supply?.name}</p>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      widthExcel: 12,
      width: 100,
      render(item: any) {
        return (
          <p>{item?.Supply?.Equipment_Unit?.name}</p>
        );
      },
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      show: true,
      widthExcel: 20,
      width: 120,
      render: (item: any) => <p>{formatCurrencyVN(item?.Supply?.unit_price)}</p>,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      widthExcel: 30,
      width: 150,
      render(item: any) {
        return (
          <p>{item?.Supply?.provider}</p>
        );
      },
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      show: true,
      widthExcel: 15,
      width: 120,
      render(item: any) {
        return (
          <p>{item?.Supply?.manufacturing_country}</p>
        );
      },
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      show: true,
      widthExcel: 20,
      width: 120,
      render: (item: any) => (
        <p>{item?.quantity}</p>
      ),
    },
    {
      title: 'Tổng giá trị',
      key: 'valueTotal',
      show: true,
      widthExcel: 20,
      width: 200,
      render: (item: any) => (
        <p>{formatCurrencyVN(item?.Supply?.unit_price * item?.quantity)}</p>
      ),
    },
  ];
  const onPaginationChange = (page: number) => {
    setPage(page);
  };
  const pagination = {
    current: page,
    total: total,
    pageSize: 10,
    showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
    onChange: onPaginationChange,
  };
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">THÔNG TIN KHO</div>
      </div>
      <Divider />
      <div className="flex-between mt-10">
        <div className="grid grid-cols-2 gap-5">
          <p>Tên kho:</p>
          <p>{detailWarehouse.name}</p>
          <p>Mã kho:</p>
          <p>{detailWarehouse.code}</p>
          <p>Thủ kho:</p>
          <p>{detailWarehouse.storekeeper}</p>
          <p>Ghi chú:</p>
          <p>{detailWarehouse.note}</p>
        </div>
      </div>
      <div className="title mt-5">Danh sách vật tư trong kho</div>
      <Table
        columns={columns.filter((item: any) => item.show)}
        dataSource={supplies}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        scroll={{ x: 1500, y: 600 }}
      />
    </div>
  );
};

export default DetailWarehouse;
