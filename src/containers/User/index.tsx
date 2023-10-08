import { useEffect, useState, useContext, FC } from 'react';
import {
  DeleteFilled,
  EyeFilled,
  FilterFilled,
  PlusCircleFilled,
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
  Select,
  Table,
  Tooltip,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import userApi from 'api/user.api';
import {
  checkPermission,
  onChangeCheckbox,
  options,
  resolveDataExcel,
} from 'utils/globalFunc.util';
import ExportToExcel from 'components/Excel';
import { FilterContext } from 'contexts/filter.context';
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

interface IUserProps {
  department_id?: Number;
  isDepartment?: Boolean;
  triggerLoading?: Boolean;
}

const User: FC<IUserProps> = ({
  department_id,
  isDepartment = false,
  triggerLoading = false,
}) => {
  const { onChangeSearch } = useSearchName();
  const { roles, departments } = useContext(FilterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const currentDepartment = query?.department_id;
  const currentRole = query?.role_id;
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const [department, setDepartment] = useState<any>(currentDepartment);
  const [role, setRole] = useState<any>(currentRole);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(
    currentName ? false : true
  );
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      show: false,
      widthExcel: 25,
      render: (item: any) => (
        <img src={image} alt="logo" className="w-20 h-20" />
      ),
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
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
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Chức vụ',
      key: 'role_id',
      show: true,
      widthExcel: 25,
      render: (item: any) => <>{item?.Role?.name}</>,
    },
    {
      title: 'Khoa phòng',
      key: 'department_id',
      show: true,
      widthExcel: 30,
      render: (item: any) => <>{item?.Department?.name}</>,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <div>
          <Tooltip title="Chi tiết người dùng" className="mr-4">
            <Link to={`/user/detail/${item.id}`}>
              <EyeFilled
                className={
                  checkPermission(permissions.USER_READ) ? '' : 'hidden'
                }
              />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(item.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteFilled
                className={
                  checkPermission(permissions.USER_DELETE) ? '' : 'hidden'
                }
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  const handleDeleteUser = (id: number) => {
    userApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Xóa thành công!');
          searchUsers();
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
    showTotal: (total: number) => `Tổng cộng: ${total} người dùng`,
    onChange: onPaginationChange,
  };

  const searchUsers = () => {
    setLoading(true);
    userApi
      .search({
        keyword: name,
        page,
        role_id: role,
        department_id: department_id || department,
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setUsers(data.users.rows);
          setTotal(data.users.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    searchUsers();
  }, [nameSearch, page, role, department, triggerLoading]);

  const onChangeSelect = (key: string, value: any) => {
    if (key === 'department_id') {
      setDepartment(value);
    }
    if (key === 'role_id') {
      setRole(value);
    }
    let newSearchQuery: any = { ...searchQuery, [`${key}`]: value };
    setSearchQuery(newSearchQuery);
    if (newSearchQuery[`${key}`] === undefined) {
      delete newSearchQuery[`${key}`];
    }
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    if (Object.keys(newSearchQuery)?.length !== 0) {
      navigate(`${pathName}?page=${page}&${searchQueryString}`);
    } else {
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  };

  const downloadUserList = async () => {
    setLoadingDownload(true);
    const res = await userApi.search({
      keyword: name,
      role_id: role,
      department_id: department_id || department,
    });
    const { users } = res?.data?.data;
    const data = users.map((x: any) => ({
      name: x.name,
      email: x.email,
      phone: x.phone || '',
      address: x.address || '',
      role_id: x.Role?.name,
      department_id: x.Department?.name || '',
    }));
    resolveDataExcel(data, 'Danh sách người dùng', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">
          {isDepartment ? 'Danh sách thành viên' : 'DANH SÁCH NGƯỜI DÙNG'}
        </div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadUserList}
            loading={loadingDownload}
          />
          {checkPermission(permissions.USER_CREATE) && (
            <Button
              className="button_excel"
              onClick={() => navigate('/user/create_user')}
            >
              <PlusCircleFilled />
              <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
            </Button>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div>
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
          <Select
            showSearch
            placeholder="Vai trò"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('role_id', value)}
            // onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="select-custom w-1/5"
            options={options(roles)}
            value={role}
          />
          <Select
            showSearch
            placeholder="Khoa Phòng"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('department_id', value)}
            // onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className={`select-custom w-1/5 ${department_id ? 'hidden' : ''}`}
            options={options(departments)}
            value={department}
          />
          <Input
            placeholder="Tìm kiếm người dùng"
            allowClear
            value={name}
            className="input"
            onChange={(e) =>
              onChangeSearch(
                e,
                setName,
                searchQuery,
                setSearchQuery,
                searchQueryString
              )
            }
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={users}
        className="mt-6 shadow-md"
        footer={() =>
          showFooter && <TableFooter paginationProps={pagination} />
        }
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default User;
