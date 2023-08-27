import { useContext, useEffect, useState } from 'react';
import {
  DeleteFilled, EyeFilled, FileExcelFilled, FilterFilled, PlusCircleFilled,
} from '@ant-design/icons';
import { Button, Divider, Input, Pagination, Popconfirm, Row, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import categoryApi from 'api/category.api';
import { FilterContext } from 'contexts/filter.context';

interface DataType {
  id: number;
  name: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
}
const limit: number = 10;

const TableFooter = ({
  paginationProps
}: any) => {

  return (
    <Row
      justify='space-between'
    >
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const EquipmentType = () => {

  const { groups } = useContext(FilterContext);
  const options = (array: any) => {
    return array.map((item: any) => {
      let o: any = {};
      o.value = item.id;
      o.label = item.name;
      return o;
    })
  }
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const [types, setTypes] = useState([]);
  const [page, setPage] = useState<number>(currentPage);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(currentName ? false : true);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);

  const handleDelete = (id: number) => {
    categoryApi.deleteType(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          getAll(currentPage);
          toast.success("Xóa thành công!");

        } else {
          toast.error(message);
        }
      })
      .catch(error => toast.error(error))
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    navigate(`${pathName}?page=${page}`);
  }

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} loại thiết bị`,
    onChange: onPaginationChange,
  }

  const getAll = async (page: number) => {
    setLoading(true);
    categoryApi.listType(page)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setTypes(data.types.rows);
          setTotal(data.types.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAll(page);
  }, [page, currentPage]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã loại thiết bị',
      key: 'alias',
      dataIndex: 'alias',
    },
    {
      title: 'Nhóm thiết bị',
      key: 'group_id',
      render: (item: any) => (
        <>
          {item?.Equipment_Group?.name}
        </>
      )
    },
    {
      title: 'Ngày khởi tạo',
      key: 'createdAt',
      render: (item: any) => (
        <>
          {new Date(item.createdAt).toLocaleDateString()}
        </>
      )
    },
    {
      title: 'Ngày chỉnh sửa',
      key: 'updatedAt',
      render: (item: any) => (
        <>
          {new Date(item.updatedAt).toLocaleDateString()}
        </>
      )
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (item: any) => (
        <div>
          <Tooltip title='Chi tiết' className='mr-4'>
            <Link to={`/category/type/detail/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
          <Tooltip title='Xóa'>
            <Popconfirm
              title="Bạn muốn xóa loại thiết bị này?"
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
    if (name) {
      categoryApi.searchType(name)
        .then((res: any) => {
          const { success, data } = res.data;
          if (success) {
            setTypes(data.types);
          }
        })
        .catch()
    }
  }

  const onChangeSearch = (e: any) => {
    setName(e.target.value);
    if (e.target.value !== "") {
      setShowFooter(false);
      navigate(`${pathName}?name=${e.target.value}`)
    } else {
      setShowFooter(true);
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  }

  useEffect(() => {
    search(nameSearch);
  }, [nameSearch])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH LOẠI THIẾT BỊ</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/category/type/create')}
          >
            <PlusCircleFilled />
            <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
          </Button>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/category/type/import_by_excel')}
          >
            <FileExcelFilled />
            <div className="font-medium text-md text-[#5B69E6]">Nhập Excel</div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder='Tìm kiếm loại thiết bị'
            allowClear
            value={name}
            className="rounded-lg h-9 border-[#A3ABEB] border-2"
            onChange={(e) => onChangeSearch(e)}
          />
          <Select
            showSearch
            placeholder="Chọn nhóm thiết bị"
            optionFilterProp="children"
            allowClear
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(groups)}
          // onChange={onChange}
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={types}
        className="mt-6 shadow-md"
        footer={() =>
          showFooter && <TableFooter paginationProps={pagination} />
        }
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default EquipmentType