import { useContext, useEffect, useState } from 'react';
import {
  ExclamationCircleFilled,
  DeleteFilled,
  EditFilled,
  FileWordFilled,
  EyeFilled,
  FilterFilled,
  SelectOutlined,
  ImportOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  Select,
  Table,
  Menu,
  Row,
  Pagination,
  Popconfirm,
  Tooltip,
  Checkbox,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import './index.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import equipmentApi from 'api/equipment.api';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import { NotificationContext } from 'contexts/notification.context';
import ModalReport from 'components/ModalReport';
import {
  checkPermission,
  checkRoleFromData,
  getCurrentUser,
  onChangeCheckbox,
  options,
  resolveDataExcel,
} from 'utils/globalFunc.util';
import ModalTransfer from 'components/ModalTransfer';
import useSearchName from 'hooks/useSearchName';
import { permissions } from 'constants/permission.constant';
import ExportToExcel from 'components/Excel';
import type { PaginationProps } from 'antd';
import { formatCurrency } from 'utils/globalFunc.util';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const List = () => {
  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
  const { statuses, departments } = useContext(FilterContext);
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
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [status, setStatus] = useState<any>(currentStatus);
  const [department, setDepartment] = useState<any>(currentDepartment);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentRiskLevel);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [dataReport, setDataReport] = useState<any>({});
  const [dataTransfer, setDataTransfer] = useState<any>({});

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      show: true,
      render(item: any) {
        return <img src={image} alt="logo" />;
      },
      widthExcel: 30,
      width: 100,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
      width: 300,
    },
    {
      title: 'Model',
      key: 'model',
      dataIndex: 'model',
      show: true,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Serial',
      key: 'serial',
      dataIndex: 'serial',
      show: true,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Nước sản xuất',
      key: 'manufacturing_country_id',
      show: true,
      dataIndex: 'manufacturing_country_id',
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Năm sử dụng',
      key: 'year_in_use',
      show: true,
      dataIndex: 'year_in_use',
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Số hiệu TSCĐ',
      key: 'fixed_asset_number',
      show: true,
      dataIndex: 'fixed_asset_number',
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Giá trị nhập',
      key: 'initial_value',
      show: true,
      dataIndex: 'initial_value',
      widthExcel: 30,
      render: (item: number) => <div>{formatCurrency(item)}</div>,
      width: 200,
    },
    {
      title: 'Khấu hao hàng năm',
      key: 'annual_depreciation',
      show: true,
      dataIndex: 'annual_depreciation',
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Giá trị còn lại',
      key: 'residual_value',
      show: true,
      dataIndex: 'residual_value',
      widthExcel: 30,
      render: (item: number) => <div>{formatCurrency(item)}</div>,
      width: 200,
    },
    {
      title: 'Ghi chú',
      key: 'note',
      show: false,
      dataIndex: 'note',
      widthExcel: 30,
      width: 200,
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////

    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      render: (item: any) => <div>{item?.Equipment_Status?.name}</div>,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: false,
      render: (item: any) => <div>{item?.Equipment_Unit?.name}</div>,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Khoa - Phòng',
      key: 'department',
      show: false,
      render: (item: any) => <div>{item?.Department?.name}</div>,
      widthExcel: 30,
      width: 200,
    },
    {
      title: 'Năm sản xuất',
      key: 'year_of_manufacture',
      show: false,
      dataIndex: 'year_of_manufacture',
      widthExcel: 30,
      width: 200,
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////

    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      with: 800,
      render: (item: any) => (
        <Menu className="flex flex-row items-center">
          {item?.Equipment_Status?.id === 3 && (
            <>
              <Menu.Item
                key="bell"
                className={`${
                  checkPermission(permissions.REPORT_EQUIPMENT_CREATE)
                    ? ''
                    : 'hidden'
                }`}
              >
                <Tooltip title="Báo hỏng thiết bị">
                  <ExclamationCircleFilled
                    onClick={() => setReportFields(item)}
                  />
                </Tooltip>
              </Menu.Item>
              {item?.Transfers[0]?.transfer_status !== 0 && (
                <>
                  <Menu.Item
                    key="transfer"
                    className={`${
                      checkPermission(permissions.TRANFER_EQUIPMENT_CREATE)
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    <Tooltip title="Điều chuyển thiết bị">
                      <RetweetOutlined
                        onClick={() => setTransferFields(item)}
                      />
                    </Tooltip>
                  </Menu.Item>
                </>
              )}
            </>
          )}
          <Menu.Item key="detail">
            <Tooltip title="Hồ sơ thiết bị">
              <Link to={`/equipment/detail/${item.id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          {item?.Equipment_Status?.id !== 7 && (
            <Menu.Item
              key="update_equipment"
              className={`${
                checkPermission(permissions.EQUIPMENT_UPDATE) ? '' : 'hidden'
              }`}
            >
              <Tooltip title="Cập nhật thiết bị">
                <Link to={`/equipment/update/${item.id}`}>
                  <EditFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
          {item?.Equipment_Status?.id === 7 && (
            <Menu.Item key="liquidation_word">
              <Tooltip title="Biên bản thanh lý">
                <Link to={`/equipment/liquidation_detail/${item?.id}`}>
                  <FileWordFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
          <Menu.Item
            key="delete"
            className={`${
              checkPermission(permissions.EQUIPMENT_DELETE) ? '' : 'hidden'
            }`}
          >
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
  const current_user: any = getCurrentUser();
  const sender_id: number = current_user?.id;
  const current_username = current_user?.name;
  const isHasRole: boolean = checkRoleFromData();

  const setReportFields = (item: any) => {
    setShowReportModal(true);
    setDataReport({
      name: item.name,
      equipment_id: item.id,
      department_id: item.department_id,
      department: item?.Department?.name,
      reporting_person_id: sender_id,
    });
  };

  const setTransferFields = (item: any) => {
    setShowTransferModal(true);
    setDataTransfer({
      equipment_name: item.name,
      equipment_id: item.id,
      from_department_id: item.department_id,
      from_department_name: item?.Department?.name,
      create_user_id: sender_id,
      create_user: current_username,
    });
  };

  const onPaginationChange = (page: number) => {
    setPage(page);
    searchQuery.page = page;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const handleDelete = (id: number) => {
    equipmentApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          search();
          toast.success('Xóa thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
  };

  const search = () => {
    setLoading(true);
    equipmentApi
      .search({
        name: nameSearch,
        status_id: status,
        type_id: type,
        department_id: department,
        risk_level: level,
        page,
        limit,
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipments(data.equipments.rows);
          setTotal(data.equipments.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search();
  }, [nameSearch, status, type, department, level, page, limit]);

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
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const downloadEquipmentList = async () => {
    setLoadingDownload(true);
    const res = await equipmentApi.search({
      name: nameSearch,
      status_id: status,
      type_id: type,
      department_id: department,
      risk_level: level,
    });
    const equipment = res?.data?.data?.equipments;
    const data = equipment.map((x: any) => ({
      code: x.code,
      name: x.name,
      model: x.model,
      serial: x.serial,
      status: x?.Equipment_Status?.name,
      type: x?.Equipment_Type?.name,
      unit: x?.Equipment_Unit?.name,
      department: x?.Department?.name,
      risk_level: x?.Equipment_Risk_Level?.name,
      manufacturer_id: x.manufacturer_id,
      manufacturing_country_id: x.manufacturing_country_id,
      year_of_manufacture: x.year_of_manufacture,
      year_in_use: x.year_in_use,
      initial_value: x.initial_value,
      annual_depreciation: x.annual_depreciation,
    }));
    resolveDataExcel(data, 'Danh sách thiết bị', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadEquipmentList}
            loading={loadingDownload}
          />
          <Button
            className="button_excel"
            onClick={() => navigate('/equipment/import_excel_eq')}
          >
            <ImportOutlined />
            <div className="font-medium text-md text-[#5B69E6]">
              Nhập thiết bị từ Excel
            </div>
          </Button>
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
            placeholder="Tất cả Trạng thái"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('status_id', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="select-custom"
            options={options(statuses)}
            value={status}
          />
          {isHasRole && (
            <Select
              showSearch
              placeholder="Khoa - Phòng"
              optionFilterProp="children"
              onChange={(value: any) => onChangeSelect('department_id', value)}
              onSearch={onSearch}
              allowClear
              filterOption={(input, option) =>
                (option!.label as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={options(departments)}
              value={department}
            />
          )}
          <Input
            placeholder="Tìm kiếm thiết bị"
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
        dataSource={equipments}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
        scroll={{ x: 2800, y: 500 }}
      />
      <ModalReport
        showReportModal={showReportModal}
        setShowReportModal={() => setShowReportModal(false)}
        callback={() => {
          increaseCount();
          getAllNotifications();
          search();
        }}
        dataReport={dataReport}
      />
      <ModalTransfer
        showTransferModal={showTransferModal}
        setShowTransferModal={() => setShowTransferModal(false)}
        callback={() => {
          increaseCount();
          getAllNotifications();
          search();
        }}
        dataTransfer={dataTransfer}
      />
    </div>
  );
};

export default List;
