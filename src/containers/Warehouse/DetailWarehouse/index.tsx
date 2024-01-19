import {
  Divider,
  // Input,
  // Pagination, Row,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import warehouseApi from 'api/warehouse.api';
import image from 'assets/image.png';
import { formatCurrencyVN } from 'utils/validateFunc.util';
import supplyApi from 'api/suplly.api';
import { supply_status } from 'constants/dataFake.constant';
// import useDebounce from 'hooks/useDebounce';
// const TableFooter = ({ paginationProps }: any) => {
//   return (
//     <Row justify="space-between">
//       <div></div>
//       <Pagination {...paginationProps} />
//     </Row>
//   );
// };
const DetailWarehouse = () => {
  const { id } = useParams();
  const [detailWarehouse, setDetailWarehouse] = useState<any>('');
  const [supplies, setSupplies] = useState<any>();
  const [total, setTotal] = useState<number>(1);
  // const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  // const [name, setName] = useState<string>('');
  // const nameSearch = useDebounce(name, 500);
  useEffect(() => {
    if (id) {
      setLoading(true);
      warehouseApi
        .detail(+id)
        .then((res: any) => {
          const { success, data } = res.data;
          if (success) {
            const { name, code, note, storekeeper, id } = data.warehouse;
            setDetailWarehouse({
              id,
              name,
              code,
              storekeeper,
              note,
            });
          }
        })
        .catch()
        .finally(() => setLoading(false));
    }
  }, [id]);
  const getSuppliesList = () => {
    setLoading(true);
    supplyApi
      .listSuppliesByWarehouse({
        warehouseId: Number(id),
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(
            data.supplies.map((item: any) => ({
              ...item.Supply,
              quantity: item.quantity,
            }))
          );
          setTotal(data.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getSuppliesList();
  }, []);
  console.log(supplies);

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      dataIndex: 'image',
      show: true,
      render(item: any) {
        return (
          <img
            src={item || image}
            alt="logo"
            className="w-full  aspect-square object-contain"
          />
        );
      },
      width: 120,
    },
    {
      title: 'Mã vật tư',
      key: 'code',
      dataIndex: 'code',
      show: true,
      widthExcel: 15,
      width: 150,
    },
    {
      title: 'Số lô',
      key: 'lot_number',
      dataIndex: 'lot_number',
      show: true,
      widthExcel: 15,
      width: 150,
    },
    {
      title: 'Tên vật tư',
      key: 'name',
      dataIndex: 'name',
      show: true,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      width: 150,
      widthExcel: 30,
      render: (item: any) => (
        <p>
          {supply_status?.find((x: any) => x.value === item?.status)?.label}
        </p>
      ),
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      widthExcel: 12,
      width: 100,
      render(item: any) {
        return <p>{item?.Equipment_Unit?.name}</p>;
      },
    },
    {
      title: 'Đơn giá',
      key: 'unit_price',
      dataIndex: 'unit_price',
      show: true,
      widthExcel: 20,
      width: 120,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      dataIndex: 'provider',
      show: true,
      widthExcel: 30,
      width: 150,
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country',
      dataIndex: 'manufacturing_country',
      show: true,
      widthExcel: 15,
      width: 120,
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      dataIndex: 'quantity',
      show: true,
      widthExcel: 20,
      width: 120,
    },
    {
      title: 'Tổng giá trị',
      key: 'valueTotal',
      show: true,
      widthExcel: 20,
      width: 200,
      render: (item: any) => (
        <p>{formatCurrencyVN(item?.unit_price * item?.quantity)}</p>
      ),
    },
  ];
  // const onPaginationChange = (page: number) => {
  //   setPage(page);
  // };
  // const pagination = {
  //   current: page,
  //   total: total,
  //   pageSize: 10,
  //   showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
  //   onChange: onPaginationChange,
  // };
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
      {/* <div className="flex justify-start my-4">
        <Input
          placeholder="Tìm kiếm vật tư"
          allowClear
          value={name}
          className="input w-1/2"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div> */}
      <span>{`Số lượng vật tư: ${total}`}</span>
      <Table
        columns={columns.filter((item: any) => item.show)}
        dataSource={supplies}
        className="mt-6 shadow-md"
        // footer={() => <TableFooter paginationProps={pagination} />}
        // pagination={false}
        scroll={{ x: 1500, y: 600 }}
        loading={loading}
      />
    </div>
  );
};

export default DetailWarehouse;
