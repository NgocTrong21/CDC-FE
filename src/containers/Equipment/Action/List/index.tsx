import { useContext, useEffect, useState } from 'react';
import {
  CarFilled, ExclamationCircleFilled, PlusCircleFilled,
  DeleteFilled, EditFilled, FileWordFilled, ToolFilled,
  EyeFilled, FileExcelFilled, FilterFilled, SelectOutlined,
  ImportOutlined, RightCircleFilled, PlusSquareFilled, RetweetOutlined,
} from '@ant-design/icons';
import {
  Button, Divider, Input,
  Select, Table, Menu, Row, Pagination,
  Popconfirm, Tooltip, Form, Checkbox,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import './index.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import equipmentApi from 'api/equipment.api';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import departmentApi from 'api/department.api';
import { CURRENT_USER } from 'constants/auth.constant';
import { NotificationContext } from 'contexts/notification.context';
import ModalHandover from 'components/ModalHandover';
import ModalReport from 'components/ModalReport';
import ModalHandoverSuccess from 'components/ModalHandoverSuccess';
import { onChangeCheckbox, options } from 'utils/globalFunc.util';
import ModalTransfer from 'components/ModalTransfer';
import useSearchName from 'hooks/useSearchName';

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify='space-between'>
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const List = () => {

  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const { statuses, departments, levels, types } = useContext(FilterContext);
  const [equipments, setEquipments] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const currentStatus = query?.status_id;
  const currentDepartment = query?.department_id;
  const currentType = query?.type_id;
  const currentRiskLevel = query?.risk_level;
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [status, setStatus] = useState<any>(currentStatus);
  const [department, setDepartment] = useState<any>(currentDepartment);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentRiskLevel);
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showHandoverSuccessModal, setShowHandoverSuccessModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [employeeInCharge, setEmployeeInCharge] = useState<any>([]);
  const [employeeInUse, setEmployeeInUse] = useState<any>([]);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [dataHandover, setDataHandover] = useState<any>({});
  const [dataReport, setDataReport] = useState<any>({});
  const [dataTransfer, setDataTransfer] = useState<any>({});
  const [dataHandoverSuccess, setDataHandoverSuccess] = useState<any>({});

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      show: false,
      render(item: any) {
        return (
          <img src={image} alt="logo" className='w-32 h-32' />
        );
      }
    },
    {
      title: 'Mã thiết bị',
      dataIndex: 'code',
      key: 'code',
      show: true,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      show: true,
    },
    {
      title: 'Model',
      key: 'model',
      dataIndex: 'model',
      show: true,
    },
    {
      title: 'Serial',
      key: 'serial',
      dataIndex: 'serial',
      show: true,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Status?.name}</div>
      )
    },
    {
      title: 'Loại thiết bị',
      key: 'type',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Type?.name}</div>
      )
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Unit?.name}</div>
      )
    },
    {
      title: 'Khoa - Phòng',
      key: 'room',
      show: true,
      render: (item: any) => (
        <div>{item?.Department?.name}</div>
      )
    },
    {
      title: "Mức độ rủi ro",
      key: "risk_level",
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Risk_Level?.name}</div>
      )
    },
    {
      title: "Hãng sản xuất",
      key: "manufacturer_id",
      show: false,
      dataIndex: 'manufacturer_id',
    },
    {
      title: "Xuất sứ",
      key: "manufacturing_country_id",
      show: false,
      dataIndex: 'manufacturing_country_id',
    },
    {
      title: "Năm sản xuất",
      key: "year_of_manufacture",
      show: false,
      dataIndex: 'year_of_manufacture',
    },
    {
      title: "Năm sử dụng",
      key: "year_in_use",
      show: true,
      dataIndex: 'year_in_use',
    },
    {
      title: "Giá trị ban đầu",
      key: "initial_value",
      show: false,
      dataIndex: 'initial_value',
    },
    {
      title: "Khấu hao hàng năm",
      key: "annual_depreciation",
      show: false,
      dataIndex: 'annual_depreciation',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className='flex flex-row items-center'>
          {
            item?.Equipment_Status?.id === 2 &&
            <>
              <Menu.Item key="handover">
                <Tooltip title="Bàn giao thiết bị">
                  <RightCircleFilled onClick={() => setHandoverFields(item)} />
                </Tooltip>
              </Menu.Item>
            </>
          }
          {
            item?.Equipment_Status?.id === 3 &&
            <>
              <Menu.Item key="bell">
                <Tooltip title="Báo hỏng thiết bị">
                  <ExclamationCircleFilled onClick={() => setReportFields(item)} />
                </Tooltip>
              </Menu.Item>
              {
                item?.Transfers[0]?.transfer_status !== 0 &&
                <>
                  <Menu.Item key="transfer">
                    <Tooltip title="Điều chuyển thiết bị">
                      <RetweetOutlined onClick={() => setTransferFields(item)} />
                    </Tooltip>
                  </Menu.Item>
                </>
              }
              <Menu.Item key="supplies">
                <Tooltip title="Nhập vật tư kèm theo">
                  <Popconfirm
                    title="Nhập vật tư kèm theo"
                    onConfirm={() => navigate(`/equipment/import_supplies/${item?.id}`)}
                    onCancel={() => navigate(`/equipment/import_supply/${item?.id}`)}
                    okText="Chọn vật tư sẵn có"
                    cancelText="Nhập mới"
                  >
                    <PlusSquareFilled />
                  </Popconfirm>
                </Tooltip>
              </Menu.Item>
            </>
          }
          <Menu.Item key="detail">
            <Tooltip title="Hồ sơ thiết bị">
              <Link to={`/equipment/detail/${item.id}`}><EyeFilled /></Link>
            </Tooltip>
          </Menu.Item>
          {
            item?.Equipment_Status?.id !== 7 &&
            <Menu.Item key="update_equipment">
              <Tooltip title="Cập nhật thiết bị">
                <Link to={`/equipment/update/${item.id}`}><EditFilled /></Link>
              </Tooltip>
            </Menu.Item>
          }
          {
            item?.Equipment_Status?.id === 6 &&
            <Menu.Item key="liquidation">
              <Tooltip title="Thanh lý thiết bị">
                <CarFilled />
              </Tooltip>
            </Menu.Item>
          }
          {
            item?.Equipment_Status?.id === 7 &&
            <Menu.Item key="liquidation_word">
              <Tooltip title="Biên bản thanh lý">
                <Link to={`/equipment/liquidation_detail/${item?.id}`}><FileWordFilled /></Link>
              </Tooltip>
            </Menu.Item>
          }
          <Menu.Item key="delete">
            <Tooltip title="Xóa thiết bị">
              <Popconfirm
                title="Bạn muốn xóa thiết bị này?"
                onConfirm={() => handleDelete(item.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteFilled />
              </Popconfirm>
            </Tooltip>
          </Menu.Item>
        </Menu>
      ),
    },
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);
  const current_user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '')
  const sender_id: number = current_user?.id;
  const current_username = current_user?.name;

  const setHandoverFields = (item: any) => {
    setDataHandover({
      name: item.name,
      equipment_id: item.id,
      handover_create_id: current_user?.id,
    })
    setShowHandoverModal(true);
  }

  const setReportFields = (item: any) => {
    setShowReportModal(true);
    setDataReport({
      name: item.name,
      equipment_id: item.id,
      department_id: item.department_id,
      department: item?.Department?.name,
      reporting_person_id: sender_id,
      code: `XXXX-${item?.id}-${new Date().getTime()}`
    })
  }

  const setTransferFields = (item: any) => {
    setShowTransferModal(true);
    setDataTransfer({
      equipment_name: item.name,
      equipment_id: item.id,
      from_department_id: item.department_id,
      from_department_name: item?.Department?.name,
      create_user_id: sender_id,
      transfer_create_user: current_username,
    })
  }

  const onPaginationChange = (page: number) => {
    setPage(page);
    searchQuery.page = page;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  }

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
  }

  const handleDelete = (id: number) => {
    equipmentApi.delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          search(nameSearch, status, type, department, level, page);
          toast.success("Xóa thành công!");

        } else {
          toast.error(message);
        }
      })
      .catch(error => toast.error(error))
  }

  const search = (name: string, status_id: any,
    type_id: any, department_id: any,
    risk_level: any, page: number) => {
    equipmentApi.search({ name, status_id, type_id, department_id, risk_level, page })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipments(data.equipments.rows);
          setTotal(data.equipments.count);
        }
      })
      .catch()
  }

  useEffect(() => {
    search(nameSearch, status, type, department, level, page)
  }, [nameSearch, status, type, department, level, page])


  const onChangeSelect = (key: string, value: any) => {
    setPage(1);
    if (key === 'status_id') {
      setStatus(value);
    }
    if (key === 'type_id') {
      setType(value);
    }
    if (key === 'department_id') {
      setDepartment(value);
    }
    if (key === 'risk_level') {
      setLevel(value);
    }
    delete searchQuery.page;
    let newSearchQuery: any = { ...searchQuery, [`${key}`]: value };
    setSearchQuery(newSearchQuery);
    if (newSearchQuery[`${key}`] === undefined) {
      delete newSearchQuery[`${key}`];
    }
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    if (Object.keys(newSearchQuery)?.length !== 0) {
      navigate(`${pathName}?page=1&${searchQueryString}`);
    } else {
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  }

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const onChangeDepartment = (value: any) => {
    departmentApi.listEmployees(value)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEmployeeInCharge(data.employees);
          setEmployeeInUse(data.employees);
        }
      })
      .catch()
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
          >
            <FileExcelFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
          </Button>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate("/equipment/import_excel_eq")}
          >
            <ImportOutlined />
            <div className="font-medium text-md text-[#5B69E6]">Nhập Excel</div>
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
          <Select
            showSearch
            placeholder="Tất cả Trạng thái"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('status_id', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            className="select-custom"
            options={options(statuses)}
            value={status}
          />
          <Select
            showSearch
            placeholder="Khoa - Phòng"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('department_id', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(departments)}
            value={department}
          />
          <Select
            showSearch
            placeholder="Mức độ rủi ro"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('risk_level', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(levels)}
            value={level}
          />

          <Select
            showSearch
            placeholder="Loại thiết bị"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('type_id', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(types)}
            value={type}
          />
          <Input
            placeholder='Tìm kiếm thiết bị'
            allowClear
            value={name}
            className="input"
            onChange={(e) => onChangeSearch(e, setName, searchQuery, setSearchQuery, searchQueryString)}
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={equipments}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
      <ModalHandover
        showHandoverModal={showHandoverModal}
        setShowHandoverModal={() => setShowHandoverModal(false)}
        callback={() => {
          increaseCount();
          getAllNotifications();
          setShowHandoverSuccessModal(true);
          search(nameSearch, status, type, department, level, page);
        }}
        onChangeDepartment={onChangeDepartment}
        employeeInCharge={employeeInCharge}
        employeeInUse={employeeInUse}
        dataHandover={dataHandover}
        setDataHandoverSuccess={(item: any) => setDataHandoverSuccess(item)}
      />
      <ModalReport
        showReportModal={showReportModal}
        setShowReportModal={() => setShowReportModal(false)}
        callback={() => {
          increaseCount();
          getAllNotifications();
          search(nameSearch, status, type, department, level, page)
        }}
        dataReport={dataReport}
      />
      <ModalHandoverSuccess
        showHandoverSuccessModal={showHandoverSuccessModal}
        setShowHandoverSuccessModal={() => setShowHandoverSuccessModal(false)}
        dataHandover={dataHandoverSuccess}
      />
      <ModalTransfer
        showTransferModal={showTransferModal}
        setShowTransferModal={() => setShowTransferModal(false)}
        callback={() => {
          search(nameSearch, status, type, department, level, page)
        }}
        dataTransfer={dataTransfer}
      />
    </div >
  )
}

export default List