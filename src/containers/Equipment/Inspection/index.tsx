import { useEffect, useState, useContext } from 'react';
import {
  CheckCircleFilled,
  EyeFilled,
  FilterFilled,
  PlusCircleFilled,
  ProfileFilled,
  SelectOutlined,
} from '@ant-design/icons';
import {
  Checkbox,
  Divider,
  Input,
  Menu,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ExportToExcel from 'components/Excel';
import useQuery from 'hooks/useQuery';
import useSearchName from 'hooks/useSearchName';
import {
  checkPermission,
  checkRoleFromData,
  getCurrentUser,
  onChangeCheckbox,
  options,
} from 'utils/globalFunc.util';
import { FilterContext } from 'contexts/filter.context';
import type { PaginationProps } from 'antd';
import moment from 'moment';
import ModalInspection from 'components/ModalInspection';
import { NotificationContext } from 'contexts/notification.context';
import equipmentInspectionApi from 'api/equipment_inspection.api';
import { permissions } from 'constants/permission.constant';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Inspection = () => {
  const columns: any = [
    {
      title: 'Mã thiết bị',
      key: 'code',
      show: true,
      dataIndex: 'code',
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      show: true,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      render: (item: any) => <div>{item?.Equipment_Status?.name}</div>,
    },
    {
      title: 'Loại thiết bị',
      key: 'type',
      show: true,
      render: (item: any) => <div>{item?.Equipment_Type?.name}</div>,
    },
    {
      title: 'Khoa - Phòng',
      key: 'department',
      show: true,
      render: (item: any) => {
        return <div>{item?.Department?.name}</div>;
      },
    },
    {
      title: 'Chu kỳ kiểm định',
      key: 'regular_inspection',
      show: true,
      render: (item: any) => {
        return <div>{item?.regular_inspection} tháng</div>;
      },
    },
    {
      title: 'Ngày kiểm định lần cuối/Ngày bàn giao',
      key: 'lastest_inspection_date',
      show: true,
      render: (item: any) => {
        return (
          <div>
            {item?.Inspections[0]?.inspection_date
              ? moment(item?.Inspections[0]?.inspection_date).format(
                  'DD-MM-YYYY'
                )
              : item?.Handover?.handover_date
              ? moment(item?.Handover?.handover_date).format('DD-MM-YYYY')
              : ''}
          </div>
        );
      },
    },
    {
      title: 'Ngày kiểm định tiếp theo',
      key: 'next_inspection_date',
      show: true,
      render: (item: any) => {
        return (
          <div>
            {item?.Inspections[0]?.inspection_date
              ? moment(item?.Inspections[0]?.inspection_date)
                  .add(item?.regular_inspection, 'months')
                  .format('DD-MM-YYYY')
              : item?.Handover?.handover_date
              ? moment(item?.Handover?.handover_date)
                  .add(item?.regular_inspection, 'months')
                  .format('DD-MM-YYYY')
              : ''}
          </div>
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
              <Link to={`/equipment/detail/${item.id}`}>
                <EyeFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="inspection_history">
            <Tooltip title="Lịch sử kiểm định">
              <Link to={`/equipment/inspection/history/${item.id}`}>
                <ProfileFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          {item?.Inspections?.length > 0 ? (
            item?.Inspections[0]?.inspection_status === 1 && (
              <Menu.Item key="inspection_report">
                <Tooltip title="Tạo phiếu kiểm định">
                  <PlusCircleFilled
                    onClick={() => setDataInspectionFields(item)}
                  />
                </Tooltip>
              </Menu.Item>
            )
          ) : (
            <Menu.Item key="inspection_report">
              <Tooltip title="Tạo phiếu kiểm định">
                <PlusCircleFilled
                  onClick={() => setDataInspectionFields(item)}
                />
              </Tooltip>
            </Menu.Item>
          )}
          {item?.Inspections?.length > 0 &&
            item?.Inspections[0]?.inspection_status !== 1 && (
              <Menu.Item key="inspection_approve">
                <Tooltip
                  title={
                    checkPermission(permissions.ACCREDITATION_EQUIPMENT_APPROVE)
                      ? 'Phê duyệt phiếu kiểm định'
                      : 'Chi tiết phiếu kiểm định'
                  }
                >
                  <Link
                    to={`/equipment/inspection/detail/${item.id}/${
                      item?.Inspections[0]?.id
                    }?edit=${true}`}
                  >
                    <CheckCircleFilled />
                  </Link>
                </Tooltip>
              </Menu.Item>
            )}
        </Menu>
      ),
    },
  ];

  const { statuses, departments, types } = useContext(FilterContext);
  const newStatus = statuses?.filter(
    (item: any) => item?.id === 2 || item?.id === 3
  );
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
  const isHasRole: boolean = checkRoleFromData();
  const current_user: any = getCurrentUser();
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
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const nameSearch = useDebounce(name, 500);
  const [dataInspection, setDataInspection] = useState<any>({});
  const [showInspectionModal, setShowInspectionModal] =
    useState<boolean>(false);

  const setDataInspectionFields = (item: any) => {
    setDataInspection({
      name: item.name,
      equipment_id: item.id,
      department: item?.Department?.name,
      department_id: item?.Department?.id,
      inspection_create_user_id: current_user?.id,
    });
    setShowInspectionModal(true);
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    setLimit(pageSize);
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

  const getAllEquipmentInspection = () => {
    setLoading(true);
    equipmentInspectionApi
      .getInspectionList({
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

  useEffect(() => {
    getAllEquipmentInspection();
  }, [nameSearch, status, type, department, page, limit]);

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const downloadEquipmentList = async () => {};

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ CẦN KIỂM ĐỊNH</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadEquipmentList}
            loading={loadingDownload}
          />
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
      <ModalInspection
        showInspectionModal={showInspectionModal}
        setShowInspectionModal={() => setShowInspectionModal(false)}
        callback={() => {
          increaseCount();
          getAllNotifications();
          getAllEquipmentInspection();
        }}
        dataInspection={dataInspection}
      />
    </div>
  );
};

export default Inspection;
