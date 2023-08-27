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
  }
];

const Detail = () => {

  const params = useParams();
  const { id } = params;
  const [supply, setSupply] = useState<any>({});

  const getDetailEquipment = (id: any) => {
    supplyApi.detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupply(data.supply);
        }
      })
      .catch()
  }

  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);

  const generatorPDF = () => {
    const element: any = document.getElementById("detail");
    console.log('element', element)
  }

  const data: DataType[] = [
    {
      key_1: 'Giá nhập',
      value_1: `${supply?.import_price}` || '',
      key_2: 'Loại vật tư',
      value_2: `${supply?.Supply_Type?.name}`,
    },
    {
      key_1: 'Mức độ rủi ro',
      value_1: `${supply?.Equipment_Risk_Level?.name}`,
      key_2: 'Đơn vị tính',
      value_2: `${supply?.Equipment_Unit?.name}`,
    },
    {
      key_1: 'Năm sản xuất',
      value_1: `${supply?.year_of_manufacture}`,
      key_2: 'Năm sử dụng',
      value_2: `${supply?.year_in_use}`,
    },
    {
      key_1: 'Hãng sản xuất',
      value_1: `${supply?.manufacturer}`,
      key_2: 'Quốc gia',
      value_2: `${supply?.manufacturing_country}`,
    },
    {
      key_1: 'Ngày nhập kho',
      value_1: `${supply?.warehouse_import_date ? moment(supply?.warehouse_import_date).format("DD-MM-YYYY") : ''}`,
      key_2: 'Ngày hết hạn bảo hành',
      value_2: `${supply?.expiration_date ? moment(supply?.expiration_date).format("DD-MM-YYYY") : ''}`,
    },
    
  ]

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ VẬT TƯ</div>
        <Button
          type='primary'
          className="flex flex-row items-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
        >
          <FilePdfFilled />
          <div
            className="font-medium text-md text-[#5B69E6]"
            onClick={() => generatorPDF()}
          >Xuất PDF</div>
        </Button>
      </div>
      <Divider />
      <div id='detail' className=''>
        <div className='flex flex-row gap-6 my-8'>
          <div className='flex flex-col gap-4 items-center basis-1/3'>
            <Image
              src={supply?.image || image}
              width={300}
            />
            <div>Ảnh vật tư</div>
          </div>
          <div className='basis-2/3'>
            <div className='font-bold text-2xl'>{supply?.name}</div>
            <div className='mt-4'>
              <Table columns={columns} dataSource={data} pagination={false} className="shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail