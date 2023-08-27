import { useEffect, useState } from 'react';
import {  DeleteFilled, EyeFilled, FilterFilled, PlusCircleFilled,
} from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import categoryApi from 'api/category.api';

interface DataType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const EquipmentUnit = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentName = query?.name;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  
  const handleDelete = (id: number) => {
    categoryApi.detailUnit(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          getAll();
          toast.success("Xóa thành công!");

        } else {
          toast.error(message);
        }
      })
      .catch(error => toast.error(error))
  }

  const getAll = async () => {
    setLoading(true);
    categoryApi.listUnit()
      .then((res: any) => {
        const { success, data } = res.data;
        console.log(data.units);
        
        if (success) {
          setUnits(data.units);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAll();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày khởi tạo',
      key: 'createdAt',
      render: (item: any) => (
        <>
          { new Date(item.createdAt).toLocaleDateString() }
        </>
      )
    },
    {
      title: 'Ngày chỉnh sửa',
      key: 'updatedAt',
      render: (item: any) => (
        <>
          { new Date(item.updatedAt).toLocaleDateString() }
        </>
      )
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (item: any) => (
        <div>
          <Tooltip title='Chi tiết' className='mr-4'>
            <Link to={`/category/unit/detail/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
          <Tooltip title='Xóa'>
            <Popconfirm
              title="Bạn muốn xóa đơn vị tính này?"
              onConfirm={() => handleDelete(item.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteFilled />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const search = async (name: string) => {
    if(name) {
      categoryApi.searchUnit(name)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setUnits(data.groups);
        }
      })
      .catch()
    }
  }

  const onChangeSearch = (e: any) => {
    setName(e.target.value);
    if(e.target.value !== "") {
      navigate(`${pathName}?name=${e.target.value}`)
    } else {
      navigate(`${pathName}`);
    }
  }

  useEffect(() => {
    search(nameSearch);
  }, [nameSearch])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH ĐƠN VỊ TÍNH</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/category/unit/create')}
          >
            <PlusCircleFilled />
            <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder='Tìm kiếm'
            allowClear
            value={name}
            className="rounded-lg h-9 border-[#A3ABEB] border-2"
            onChange={(e) => onChangeSearch(e)}
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table 
        columns={columns} 
        dataSource={units} 
        className="mt-6 shadow-md" 
        loading={loading}
      />
    </div>
  )
}

export default EquipmentUnit