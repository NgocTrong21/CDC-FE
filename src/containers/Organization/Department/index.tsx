import { useEffect, useState } from 'react';
import {
  EyeFilled, FilterFilled,
  PlusCircleFilled, DeleteFilled, SelectOutlined,
} from '@ant-design/icons';
import {
  Button, Checkbox, Divider,
  Input, Pagination, Popconfirm,
  Row, Table, Tooltip
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import departmentApi from 'api/department.api';
import ava from 'assets/logo.png';
import { toast } from 'react-toastify';
import useQuery from 'hooks/useQuery';
import { getDataExcel, getFields, onChangeCheckbox } from 'utils/globalFunc.util';
import ExportToExcel from 'components/Excel';
import useSearchName from 'hooks/useSearchName';

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

const Department = () => {

  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const currentPage = query?.page;
  const currentName = query?.name;
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      dataIndex: 'image',
      show: false,
      widthExcel: 25,
      render: (item: any) => (
        <img
          src={ava}
          alt="logo"
          className='w-20 h-20'
        />
      )
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      show: true,
      widthExcel: 40,
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Trưởng khoa',
      key: 'head',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <Row>{item?.head?.name}</Row>
      ),
    },
    {
      title: 'Điều dưỡng trưởng',
      key: 'nurse',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <Row>{item?.nurse?.name}</Row>
      ),
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <div>
          <Tooltip title='Chi tiết khoa phòng' className='mr-4'>
            <Link to={`/organization/department/detail/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
          <Tooltip title='Xóa'>
            <Popconfirm
              title="Bạn muốn xóa Khoa - Phòng này?"
              onConfirm={() => handleDeleteDepartment(item.id)}
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
  const [columnTable, setColumnTable] = useState<any>(columns);

  const handleDeleteDepartment = (id: number) => {
    departmentApi.delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success("Xóa thành công!");

        } else {
          toast.error(message);
        }
      })
      .catch(error => toast.error(error))
  }

  const onPaginationChange = (page: number) => {
    setPage(page);
    let newSearchQuery: any = { page, ...searchQuery };
    setSearchQuery(newSearchQuery);
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  }

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} Khoa - Phòng`,
    onChange: onPaginationChange,
  }

  const searchDepartments = () => {
    departmentApi.search({ keyword: nameSearch, page})
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setDepartments(data.departments.rows);
          setTotal(data.departments.count);
        }
      })
      .catch()
  }

  useEffect(() => {
    searchDepartments();
  }, [nameSearch, page])


  const downloadDepartmentList = () => {
    let fields: any = getFields(columnTable);
    let data = departments
      .map((x: any) => ({
        name: x.name,
        alias: x.alias,
        phone: x.phone || '',
        email: x.email || '',
        address: x.address || '',
        head: x.head?.name || '',
        nurse: x.nurse?.name || '',
      }))
    let objectKey = Object.keys(data[0]);
    let newData: any = getDataExcel(data, objectKey, fields);
    const workSheetColumnName = fields?.map((item: any) => ({ title: item?.title, width: item?.width }));
    const workSheetName = 'Danh sách khoa phòng';
    const fileName = `Danh sách khoa phòng ${new Date().toISOString().substring(0, 10)}.xlsx`;
    const finalData: any = [workSheetColumnName, ...newData];

    return {
      data: finalData,
      sheetName: workSheetName,
      fileName,
      headerName: workSheetName
    }
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH KHOA - PHÒNG</div>
        <div className='flex flex-row gap-6'>
          <ExportToExcel getData={downloadDepartmentList} />
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/organization/department/create')}
          >
            <PlusCircleFilled />
            <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        <div
          className='flex flex-row gap-4 items-center mb-4'
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className='font-medium text-center cursor-pointer text-base'>Tùy chọn trường hiển thị</div>
        </div>
        {
          isShowCustomTable &&
          <div className='flex flex-row gap-4'>
            {
              columnTable.length > 0 && columnTable.map((item: any) => (
                <div>
                  <Checkbox
                    defaultChecked={item?.show}
                    onChange={(e: any) => onChangeCheckbox(item, e, columnTable, setColumnTable)}
                  />
                  <div>{item?.title}</div>
                </div>
              ))
            }
          </div>
        }
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder='Tìm kiếm khoa phòng'
            allowClear
            value={name}
            onChange={(e: any) => onChangeSearch(e, setName, searchQuery, setSearchQuery, searchQueryString)}
            className="input"
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={departments}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default Department