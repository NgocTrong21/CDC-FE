import { useState, useEffect } from 'react';
import { FilePdfFilled } from '@ant-design/icons';
import { Button, Divider, Image, Table } from 'antd';
import { useParams } from 'react-router-dom';
import image from 'assets/image.png';
import qrcode from 'assets/qrcode.png';
import type { ColumnsType } from 'antd/es/table';
import supplyApi from 'api/suplly.api';
import moment from 'moment';
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Trường',
    dataIndex: 'key_1',
    key: 'key_1',
  },
  {
    title: 'Giá trị',
    dataIndex: 'value_1',
    key: 'value_1',
  },
  {
    title: 'Trường',
    dataIndex: 'key_2',
    key: 'key_2',
  },
  {
    title: 'Giá trị',
    dataIndex: 'value_2',
    key: 'value_2',
  },
];

const Detail = () => {
  const params = useParams();
  const { id } = params;
  const [supply, setSupply] = useState<any>({});

  const getDetailEquipment = (id: any) => {
    supplyApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupply(data.supply);
        }
      })
      .catch();
  };

  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);

  const generatorPDF = () => {
    const element: any = document.getElementById('detail');
  };

  const data: DataType[] = [
    {
      key_1: 'Mã vật tư',
      value_1: `${supply?.code}` || '',
      key_2: 'Số lô',
      value_2: `${supply?.lot_number}`,
    },
    {
      key_1: 'Đơn giá',
      value_1: `${supply?.unit_price}`,
      key_2: 'Đơn vị tính',
      value_2: `${supply?.Equipment_Unit?.name || ''}`,
    },
    {
      key_1: 'Hạn sử dụng',
      value_1: `${
        supply?.expiration_date
          ? moment(supply?.expiration_date).format('DD-MM-YYYY')
          : ''
      }`,
      key_2: 'Xuất sứ',
      value_2: `${supply?.Equipment_Unit?.name}`,
    },
    {
      key_1: 'Nhà cung cấp',
      value_1: `${supply?.provider}`,
      key_2: 'Ghi chú',
      value_2: `${supply?.note || ''}`,
    },
  ];

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ VẬT TƯ</div>
      </div>
      <Divider />
      <div id="detail" className="">
        <div className="flex flex-row gap-6 my-8">
          <div className="flex flex-col gap-4 items-center basis-1/3">
            <Image src={supply?.image || image} width={300} />
            <div>Ảnh vật tư</div>
          </div>
          <div className="basis-2/3">
            <div className="font-bold text-2xl">{supply?.name}</div>
            <div className="mt-4">
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
