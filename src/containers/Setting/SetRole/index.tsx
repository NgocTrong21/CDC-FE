import { useState, useEffect } from 'react';
import { Button, Divider, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import { EditFilled, FilterFilled, PlusCircleFilled } from '@ant-design/icons';
import roleApi from 'api/role.api';

interface DataType {
  id: number;
  alias: string;
  name: string;
  group_id: number;
  createdAt: string;
  updatedAt: string;
}

const SetRole = () => {

  const navigate = useNavigate();
  const [roles, setRoles] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Alias',
      dataIndex: 'alias',
      key: 'alias',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (item: any) => (
        <>
          { new Date(item.createdAt).toLocaleDateString() }
        </>
      )
    },
    {
      title: 'Ngày cập nhật',
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
      align: 'center',
      render: (item: any) => (
        <>
          <Link to={`/setting/role/update/${item.name}/${item.id}`}><EditFilled /></Link>
        </>
      ),
    },
  ];

  const getAllRoles = () => {
    setLoading(true);
    roleApi.list()
      .then((res: any) => {
        const { success, data } = res.data;
        if(success) {
          setRoles(data.roles);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAllRoles();
  }, [])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">PHÂN QUYỀN HỆ THỐNG</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="button_excel"
            onClick={() => navigate('/setting/role/create')}
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
            className="input"
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={roles} className="mt-6 shadow-md" loading={loading}/>
    </div>
  )
}

export default SetRole