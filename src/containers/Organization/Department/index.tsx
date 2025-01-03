import { useEffect, useState } from 'react';
import {
  EyeFilled,
  FilterFilled,
  PlusCircleFilled,
  DeleteFilled,
  SelectOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from 'antd';
import image from 'assets/image.png';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import departmentApi from 'api/department.api';
import ava from 'assets/logo.png';
import { toast } from 'react-toastify';
import useQuery from 'hooks/useQuery';
import {
  checkPermission,
  onChangeCheckbox,
  resolveDataExcel,
} from 'utils/globalFunc.util';
import ExportToExcel from 'components/Excel';
import useSearchName from 'hooks/useSearchName';
import { permissions } from 'constants/permission.constant';

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

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
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      dataIndex: 'image',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <img src={item || image} alt="logo" className="w-20 h-20" />
      ),
      width: 80,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
      width: 120,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
      show: true,
      widthExcel: 20,
      width: 100,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      show: true,
      widthExcel: 40,
      width: 120,
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      show: true,
      widthExcel: 20,
      width: 100,
    },
    {
      title: 'Trưởng khoa',
      key: 'head',
      show: true,
      widthExcel: 40,
      width: 100,
      render: (item: any) => {
        const user = item?.Users?.find(
          (user: any) => user?.Role?.id === 6 || user?.Role?.id === 7
        );
        return <Row>{user?.name}</Row>;
      },
    },
    // {
    //   title: 'Điều dưỡng trưởng/Phụ trách phòng Vật tư',
    //   key: 'nurse',
    //   show: true,
    //   widthExcel: 45,
    //   render: (item: any) => {
    //     const user = item?.Users?.find(
    //       (user: any) => user?.Role?.id === 4 || user?.Role?.id === 8
    //     );
    //     return <Row>{user?.name}</Row>;
    //   },
    // },
    {
      title: 'Tác vụ',
      key: 'action',
      width: 50,
      show:
        checkPermission(permissions.DEPARTMENT_UPDATE) ||
        checkPermission(permissions.DEPARTMENT_DELETE) ||
        checkPermission(permissions.DEPARTMENT_READ),
      render: (item: any) => (
        <div>
          <Tooltip
            title="Thông tin khoa phòng"
            className={`${checkPermission(permissions.DEPARTMENT_READ) ? 'mr-4' : 'hidden'
              }`}
          >
            <Link to={`/organization/department/detail/${item.id}`}>
              <EyeFilled />
            </Link>
          </Tooltip>
          <Tooltip
            title="Xóa"
            className={`${checkPermission(permissions.DEPARTMENT_DELETE)
              ? ''
              : 'hidden'
              }`}
          >
            <Popconfirm
              title="Bạn muốn xóa Khoa - Phòng này?"
              onConfirm={() => handleDeleteDepartment(item.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteFilled
                className={
                  checkPermission(permissions.DEPARTMENT_DELETE) ? '' : 'hidden'
                }
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  const handleDeleteDepartment = (id: number) => {
    departmentApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Xóa thành công!');
          searchDepartments();
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
  };

  const onPaginationChange = (page: number) => {
    setPage(page);
    let newSearchQuery: any = { page, ...searchQuery };
    setSearchQuery(newSearchQuery);
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} Khoa - Phòng`,
    onChange: onPaginationChange,
  };

  const searchDepartments = () => {
    setLoading(true);
    departmentApi
      .search({ keyword: nameSearch, page })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setDepartments(data.departments.rows);
          setTotal(data.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    searchDepartments();
  }, [nameSearch, page]);

  const downloadDepartmentList = async () => {
    setLoadingDownload(true);
    const data = departments.map((x: any) => {
      const head = x?.Users?.find(
        (user: any) => user?.Role?.id === 4
      )?.name;
      return {
        name: x?.name,
        alias: x?.alias,
        phone: x?.phone || '',
        email: x?.email || '',
        address: x?.address || '',
        head,
      };
    });
    resolveDataExcel(data, 'Danh sách khoa phòng', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH KHOA - PHÒNG</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadDepartmentList}
            loading={loadingDownload}
          />
          {checkPermission(permissions.DEPARTMENT_CREATE) && (
            <Button
              className="button_excel"
              onClick={() => navigate('/organization/department/create')}
            >
              <PlusCircleFilled />
              <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
            </Button>
          )}
        </div>
      </div>
      {/* <Divider /> */}
      <div className="flex justify-between flex-col">
        {/* <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div> */}
        {isShowCustomTable && (
          <div className="flex flex-row gap-4">
            {columnTable.length > 0 &&
              columnTable.map((item: any) => (
                <div>
                  <Checkbox
                    defaultChecked={item?.show}
                    onChange={(e: any) =>
                      onChangeCheckbox(item, e, columnTable, setColumnTable)
                    }
                  />
                  <div>{item?.title}</div>
                </div>
              ))}
          </div>
        )}
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder="Tìm kiếm khoa phòng"
            allowClear
            value={name}
            onChange={(e: any) =>
              onChangeSearch(
                e,
                setName,
                searchQuery,
                setSearchQuery,
                searchQueryString
              )
            }
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
        scroll={{ x: 1500, y: 580 }}
      />
    </div>
  );
};

export default Department;
