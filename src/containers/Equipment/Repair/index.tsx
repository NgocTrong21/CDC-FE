import { useContext, useEffect, useState } from 'react';
import {
  CheckCircleFilled,
  EyeFilled,
  FilterFilled,
  PlusCircleFilled,
  ProfileFilled,
  RightCircleFilled,
  ScissorOutlined,
  SelectOutlined,
  ToolFilled,
} from '@ant-design/icons';
import {
  Checkbox,
  Divider,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { FilterContext } from 'contexts/filter.context';
import {
  checkPermission,
  checkRoleFromData,
  getCurrentUser,
  handleReportStatus,
  onChangeCheckbox,
  options,
  resolveDataExcel,
} from 'utils/globalFunc.util';
import moment from 'moment';
import ExportToExcel from 'components/Excel';
import ModalReHandover from 'components/ModalReHandover';
import equipmentRepairApi from 'api/equipment_repair.api';
import useSearchName from 'hooks/useSearchName';
import { broken_status } from 'constants/dataFake.constant';
import { permissions } from 'constants/permission.constant';
import type { PaginationProps } from 'antd';
import { formatCurrencyVN } from 'utils/validateFunc.util';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Repair = () => {
  const { statuses, departments, types } = useContext(FilterContext);
  const newStatus = statuses?.filter(
    (item: any) => item?.id === 4 || item?.id === 5
  );
  const isHasRole: boolean = checkRoleFromData();
  const checkScheduleRepair = (status: any) => {
    const scheduleStatus = [0, 1, 2];
    return scheduleStatus.includes(status);
  };

  const columns_highest_repair_cost: any = [
    {
      title: 'Mã thiết bị',
      key: 'code',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{item?.Equipment?.code}</div>,
    },
    {
      title: 'Tên thiết bị',
      key: 'name',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{item?.Equipment?.name}</div>,
    },
    {
      title: 'Model',
      key: 'model',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{item?.Equipment?.model}</div>,
    },
    {
      title: 'Serial',
      key: 'serial',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{item?.Equipment?.serial}</div>,
    },
    {
      title: 'Khoa - Phòng',
      key: 'department',
      show: true,
      render: (item: any) => <div>{item?.Equipment?.Department?.name}</div>,
      widthExcel: 30,
    },
    {
      title: 'Trạng thái hoạt động',
      key: 'status',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment?.Equipment_Status?.name}</div>
      ),
      widthExcel: 30,
    },
    {
      title: 'Tổng chi phí sửa chữa',
      key: 'total',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{formatCurrencyVN(item?.total)}</div>,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className="flex flex-row">
          <Menu.Item key="detail">
            <Tooltip title="Hồ sơ thiết bị">
              <Link to={`/equipment/detail/${item?.equipment_id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="history">
            <Tooltip title="Lịch sử sửa chữa">
              <Link to={`/equipment/repair/history/${item?.equipment_id}`}>
                <ProfileFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="detail">
            <Tooltip title="Ngừng sử dụng">
              <Popconfirm
                title="Bạn muốn ngừng sử dụng thiết bị này?"
                onConfirm={() => handleUnuseEquipment(item)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <ScissorOutlined />
              </Popconfirm>
            </Tooltip>
          </Menu.Item>
        </Menu>
      ),
    },
  ];

  const columns: any = [
    {
      title: 'Tên thiết bị',
      key: 'name',
      show: true,
      widthExcel: 35,
      render: (item: any) => <div>{item?.name}</div>,
    },
    {
      title: 'Khoa - Phòng',
      key: 'department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return <div>{item?.Department?.name}</div>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      widthExcel: 20,
      render: (item: any) => <div>{item?.Equipment_Status?.name}</div>,
    },
    {
      title: 'Mức độ ưu tiên',
      key: 'repair_priority',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>
          {
            broken_status.find(
              (broken_status) =>
                broken_status.value === item?.Repairs[0]?.repair_priority
            )?.label
          }
        </div>
      ),
    },
    {
      title: 'Ngày báo hỏng',
      key: 'broken_report_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>
          {item?.Repairs[0]?.broken_report_date &&
            moment(item?.Repairs[0]?.broken_report_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Ngày lên lịch sửa chữa',
      key: 'schedule_repair_date',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <>
          {item?.Repairs[0]?.schedule_repair_date &&
            moment(item?.Repairs[0]?.repair_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Ngày sửa chữa',
      key: 'repair_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>
          {item?.Repairs[0]?.repair_date &&
            moment(item?.repair_date).format('DD-MM-YYYY')}
        </>
      ),
    },
    {
      title: 'Ngày sửa xong',
      key: 'repair_completion_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>
          {item?.Repairs[0]?.repair_completion_date &&
            moment(item?.Repairs[0]?.repair_completion_date).format(
              'DD-MM-YYYY'
            )}
        </>
      ),
    },
    {
      title: 'Chi phí dự kiến',
      key: 'estimated_repair_cost',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>
          {item?.Repairs[0]?.estimated_repair_cost &&
            formatCurrencyVN(item?.Repairs[0]?.estimated_repair_cost)}
        </div>
      ),
    },
    {
      title: 'Chi phí thực tế',
      key: 'actual_repair_cost',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>
          {item?.Repairs[0]?.actual_repair_cost &&
            formatCurrencyVN(item?.Repairs[0]?.actual_repair_cost)}
        </div>
      ),
    },
    {
      title: 'Trạng thái xử lý phiếu báo hỏng',
      key: 'report_status',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return <>{handleReportStatus(item?.Repairs[0]?.report_status)}</>;
      },
    },
    {
      title: 'Trạng thái xử lý phiếu sửa chữa',
      key: 'schedule_repair_status',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{handleReportStatus(item?.Repairs[0]?.schedule_repair_status)}</>
        );
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className="flex flex-row">
          <Menu.Item key="detail">
            <Tooltip title="Hồ sơ thiết bị">
              <Link to={`/equipment/detail/${item?.id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="repair">
            <Tooltip title="Lịch sử sửa chữa">
              <Link to={`/equipment/repair/history/${item?.id}`}>
                <ProfileFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="report">
            <Tooltip title="Phiếu báo hỏng">
              <Link
                to={`/equipment/repair/broken_report/${item?.id}/${item?.Repairs[0]?.id}`}
              >
                <CheckCircleFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          {item?.Repairs[0]?.report_status === 1 &&
            !checkScheduleRepair(item?.Repairs[0]?.schedule_repair_status) && (
              <Menu.Item key="word">
                <Tooltip
                  title={` ${
                    checkPermission(permissions.REPAIR_EQUIPMENT_CREATE)
                      ? item?.Repairs[0]?.repair_status === null
                        ? 'Tạo phiếu sửa chữa'
                        : 'Xem phiếu sửa chữa'
                      : 'Xem phiếu sửa chữa'
                  }`}
                >
                  <Link
                    to={`/equipment/repair/create_schedule/${item?.id}/${item?.Repairs[0]?.id}`}
                  >
                    <PlusCircleFilled />
                  </Link>
                </Tooltip>
              </Menu.Item>
            )}
          {item?.Repairs[0]?.report_status === 1 &&
            checkScheduleRepair(item?.Repairs[0]?.schedule_repair_status) && (
              <Menu.Item key="edit">
                <Tooltip
                  title={`${
                    checkPermission(permissions.REPAIR_EQUIPMENT_UPDATE)
                      ? item?.Repairs[0]?.repair_status === null
                        ? 'Cập nhật phiếu sửa chữa'
                        : 'Xem phiếu sửa chữa'
                      : 'Xem phiếu sửa chữa'
                  }`}
                >
                  <Link
                    to={`/equipment/repair/update_schedule/${item?.id}/${item?.Repairs[0]?.id}?edit=true`}
                  >
                    <ToolFilled />
                  </Link>
                </Tooltip>
              </Menu.Item>
            )}
          {(item?.Repairs[0]?.repair_status === 3 ||
            item?.Repairs[0]?.repair_status === 4) &&
            checkPermission(permissions.REPAIR_EQUIPMENT_APPROVE) && (
              <Menu.Item key="rehandover">
                <Tooltip title="Bàn giao lại thiết bị">
                  <RightCircleFilled
                    onClick={() => setReHandoverFields(item)}
                  />
                </Tooltip>
              </Menu.Item>
            )}
        </Menu>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const [searchQuery, setSearchQuery] = useState<any>({});
  const { onChangeSearch } = useSearchName();
  let searchQueryString: string;
  const currentName = query?.name;
  const currentStatus = query?.status_id;
  const currentDepartment = query?.department_id;
  const currentType = query?.type_id;
  const currentPage = query?.page;
  const [equipments, setEquipments] = useState<any>([]);
  const [name, setName] = useState<string>(currentName);
  const [status, setStatus] = useState<number>(currentStatus);
  const [department, setDepartment] = useState<number>(currentDepartment);
  const [type, setType] = useState<any>(currentType);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [loadingUnuse, setLoadingUnuse] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const nameSearch = useDebounce(name, 500);
  const [showReHandoverModal, setShowReHandoverModal] =
    useState<boolean>(false);
  const [equipment, setEquipment] = useState({});
  const [highestRepairCost, setHighestRepairCost] = useState<any>([]);
  const current_user = getCurrentUser();

  const handleUnuseEquipment = (item: any) => {
    const data = {
      equipment_id: item.equipment_id,
      name: item?.Equipment?.name,
      department: item?.Equipment?.Department?.name,
      department_id: item?.Equipment?.Department?.id,
      create_user_id: current_user.id,
    };
    setLoadingUnuse(true);
    equipmentApi
      .unUseEquipment(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật thành công!');
          getHighestRepairCost();
        } else {
          toast.error('Cập nhật thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingUnuse(false));
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const setReHandoverFields = (item: any) => {
    setShowReHandoverModal(true);
    setEquipment({
      repair_id: item?.Repairs[0]?.id,
      id: item?.id,
      name: item?.name,
      department_id: item?.Department?.id,
      department_name: item?.Department?.name,
      repair_status: item?.Repairs[0]?.repair_status,
    });
  };

  const onChangeSelect = (key: string, value: any) => {
    if (key === 'status_id') {
      setStatus(value);
    }
    if (key === 'type_id') {
      setType(value);
    }
    if (key === 'department_id') {
      setDepartment(value);
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

  const onPaginationChange = (page: number) => {
    setPage(page);
    searchQuery.page = page;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  };

  const getAllEquipmentRepair = () => {
    setLoading(true);
    equipmentRepairApi
      .getBrokenAndRepairEqList({
        page,
        limit,
        name: nameSearch,
        status_id: status,
        type_id: type,
        department_id: department,
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

  const getHighestRepairCost = () => {
    equipmentRepairApi
      .getHighestRepairCost()
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setHighestRepairCost(data.highest_repair_cost);
        }
      })
      .catch();
  };

  useEffect(() => {
    getAllEquipmentRepair();
  }, [nameSearch, status, type, department, page, limit]);

  useEffect(() => {
    getHighestRepairCost();
  }, []);

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const downloadRepairList = async () => {
    setLoadingDownload(true);
    const res = await equipmentRepairApi.getBrokenAndRepairEqList({
      name,
      status_id: status,
      type_id: type,
      department_id: department,
    });
    const { equipments } = res?.data?.data;
    const data = equipments.map((x: any) => ({
      name: x?.Equipment?.name,
      department: x?.Equipment?.Department?.name,
      status: x?.Equipment?.Equipment_Status?.name || '',
      repair_priority: x.repair_priority,
      broken_report_date:
        x?.broken_report_date &&
        moment(x?.broken_report_date).format('DD-MM-YYYY'),
      schedule_repair_date:
        x?.schedule_repair_date &&
        moment(x?.schedule_repair_date).format('DD-MM-YYYY'),
      repair_date:
        x?.repair_date && moment(x?.repair_date).format('DD-MM-YYYY'),
      repair_completion_date:
        x?.repair_completion_date &&
        moment(x?.repair_completion_date).format('DD-MM-YYYY'),
      estimated_repair_cost: x?.estimated_repair_cost,
      actual_repair_cost: x?.actual_repair_cost,
    }));
    resolveDataExcel(
      data,
      'Danh sách thiết bị đang báo hỏng và sửa chữa',
      columnTable
    );
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">
          DANH SÁCH THIẾT BỊ ĐANG BÁO HỎNG VÀ SỬA CHỮA
        </div>
        <ExportToExcel
          callback={downloadRepairList}
          loading={loadingDownload}
        />
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
      </div>
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
          <Select
            showSearch
            placeholder="Tất cả Trạng thái"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('status_id', value)}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={options(newStatus)}
            className="select-custom"
          />
          {isHasRole && (
            <Select
              showSearch
              placeholder="Khoa - Phòng"
              optionFilterProp="children"
              onChange={(value: any) => onChangeSelect('department_id', value)}
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
          <Select
            showSearch
            placeholder="Loại thiết bị"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('type_id', value)}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={options(types)}
          />

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
      />

      {/* <div className="mb-8 mt-10">
        <div className="title mb-6">
          Danh sách thiết bị có chi phí sửa chữa cao
        </div>
        <Table
          columns={columns_highest_repair_cost}
          dataSource={highestRepairCost}
          className="mt-6 shadow-md"
          // footer={() => <TableFooter paginationProps={pagination} />}
          pagination={false}
          loading={loadingUnuse}
        />
      </div> */}

      <ModalReHandover
        equipment={equipment}
        showReHandoverModal={showReHandoverModal}
        setShowReHandoverModal={() => setShowReHandoverModal(false)}
        callback={() => getAllEquipmentRepair()}
      />
    </div>
  );
};

export default Repair;
