import { useEffect, useState } from 'react';
import {
  DeleteFilled, EyeFilled, FileExcelFilled, FilterFilled, PlusCircleFilled,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, Pagination, Popconfirm, Row, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import categoryApi from 'api/category.api';
import userApi from 'api/user.api';
import * as xlsx from 'xlsx';

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

const EquipmentGroup = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState<number>(currentPage);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(currentName ? false : true);
  const [data, setData] = useState<any>([]);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);

  const handleDelete = (id: number) => {
    categoryApi.deleteGroup(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          getAllGroups(currentPage);
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
    showTotal: (total: number) => `Tổng cộng: ${total} nhóm thiết bị`,
    onChange: onPaginationChange,
  }

  const getAllGroups = async (page: number) => {
    setLoading(true);
    categoryApi.listGroup(page)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setGroups(data.groups.rows);
          setTotal(data.groups.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAllGroups(page);
  }, [page, currentPage]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã nhóm thiết bị',
      key: 'alias',
      dataIndex: 'alias',
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
            <Link to={`/category/group/detail/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
          <Tooltip title='Xóa'>
            <Popconfirm
              title="Bạn muốn xóa nhóm thiết bị này?"
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
      categoryApi.searchGroup(name)
        .then((res: any) => {
          const { success, data } = res.data;
          if (success) {
            setGroups(data.groups);
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

  const onFinish = () => {
    userApi.uploadExcel(data)
      .then((res: any) => {
        const { success } = res.data;
        console.log('success :>> ', success);
      })
      .catch()
  }

  const readUploadFile = (e: any) => {
    let newWorkSheet: any = [];
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data: any = e?.target?.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(workSheet);
        for (let i = 2; i <= json?.length + 1; i++) {
          // const id = workSheet[`A${i}`]?.v;
          const name = workSheet[`A${i}`]?.v;
          const alias = workSheet[`B${i}`]?.v;
          newWorkSheet.push({ name, alias })
        }

        setData(newWorkSheet);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }
  
  useEffect(() => {
    search(nameSearch);
  }, [nameSearch])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH NHÓM THIẾT BỊ</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/category/group/create')}
          >
            <PlusCircleFilled />
            <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
          </Button>
          <div className="fileUploadInput">
            <input type="file" onChange={(e: any) => readUploadFile(e)} />
            <button>+</button>
          </div>
          <Form
            onFinish={onFinish}
            form={form}
          >
            <Form.Item>
              <Button
                htmlType='submit'
                className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
              >
                <FileExcelFilled />
                <div className="font-medium text-md text-[#5B69E6]">Nhập Excel</div>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder='Tìm kiếm nhóm thiết bị'
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
        dataSource={groups}
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

export default EquipmentGroup