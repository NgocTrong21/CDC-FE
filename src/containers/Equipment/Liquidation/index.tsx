import {
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
import equipmentLiquidationApi from 'api/equipment_liquidation.api';
import ExportToExcel from 'components/Excel';
import ModelLiquidation from 'components/ModelLiquidation';
import { permissions } from 'constants/permission.constant';
import { FilterContext } from 'contexts/filter.context';
import { NotificationContext } from 'contexts/notification.context';
import useDebounce from 'hooks/useDebounce';
import useQuery from 'hooks/useQuery';
import useSearchName from 'hooks/useSearchName';
import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  checkPermission,
  getDataExcel,
  getFields,
  handleReportStatus,
  onChangeCheckbox,
  options,
  resolveDataExcel,
} from 'utils/globalFunc.util';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Liquidation = () => {
  const { departments } = useContext(FilterContext);
  const columns: any = [
    {
      title: 'Tên thiết bị',
      key: 'name',
      show: true,
      widthExcel: 35,
      render: (item: any) => <div>{item?.name}</div>,
    },
    {
      title: 'Code',
      key: 'code',
      show: true,
      widthExcel: 35,
      render: (item: any) => <div>{item?.code}</div>,
    },
    {
      title: 'Model',
      key: 'model',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{item?.model}</div>,
    },
    {
      title: 'Serial',
      key: 'serial',
      show: true,
      widthExcel: 30,
      render: (item: any) => <div>{item?.serial}</div>,
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
      title: 'Ngày thanh lý',
      key: 'liquidation_date',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>
            {item?.Liquidation?.liquidation_date &&
              moment(item?.Liquidation?.liquidation_date).format('DD-MM-YYYY')}
          </>
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      key: 'liquidation_status',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return <>{handleReportStatus(item?.Liquidation?.liquidation_status)}</>;
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
          {item?.Liquidation !== null ? (
            <Menu.Item
              key="liquidation_detail"
              className={`${
                checkPermission(permissions.LIQUIDATION_EQUIPMENT_READ)
                  ? ''
                  : 'hidden'
              }`}
            >
              <Tooltip title="Phiếu yêu cầu thanh lý">
                <Link
                  to={`/equipment/liquidation/detail/${item?.id}/${item?.Liquidations[0]?.id}`}
                >
                  <ProfileFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          ) : (
            <Menu.Item
              key="liquidation_create"
              className={`${
                checkPermission(permissions.LIQUIDATION_EQUIPMENT_CREATE)
                  ? ''
                  : 'hidden'
              }`}
            >
              <Tooltip title="Tạo phiếu yêu cầu thanh lý">
                <PlusCircleFilled onClick={() => setLiquidationFields(item)} />
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
  const { onChangeSearch } = useSearchName();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const currentName = query?.name;
  const currentDepartment = query?.department_id;
  const currentPage = query?.page;
  const [equipments, setEquipments] = useState<any>([]);
  const [name, setName] = useState<string>(currentName);
  const [department, setDepartment] = useState<number>(currentDepartment);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const nameSearch = useDebounce(name, 500);
  const [showLiquidationModal, setShowLiquidationModal] =
    useState<boolean>(false);
  const [equipment, setEquipment] = useState<any>({});
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);

  const onChangeSelect = (key: string, value: any) => {
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

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
  };

  const getListUnusedEquipment = () => {
    setLoading(true);
    equipmentLiquidationApi
      .getListUnusedEquipment({ page, name, department, limit })
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
    getListUnusedEquipment();
  }, [nameSearch, department, page, limit]);

  const setLiquidationFields = (item: any) => {
    setShowLiquidationModal(true);
    setEquipment({
      id: item?.id,
      name: item?.name,
      department: item?.Department?.name,
      department_id: item?.Department?.id,
    });
  };

  const downloadLiquidationList = async () => {
    setLoadingDownload(true);
    const res = await equipmentLiquidationApi.getListUnusedEquipment({
      name: nameSearch,
      department_id: department,
    });
    const { equipments } = res?.data?.data;
    const data = equipments.map((x: any) => ({
      name: x.name,
      code: x.code,
      model: x.model,
      serial: x.serial,
      department: x.Department?.name,
    }));
    resolveDataExcel(data, 'Danh sách thiết bị ngừng sử dụng', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ NGỪNG SỬ DỤNG</div>
        <ExportToExcel
          callback={downloadLiquidationList}
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
          <Input
            placeholder="Tìm kiếm thiết bị"
            allowClear
            value={name}
            className="rounded-lg h-9 border-[#A3ABEB] border-2"
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
      <ModelLiquidation
        showLiquidationModal={showLiquidationModal}
        setShowLiquidationModal={() => setShowLiquidationModal(false)}
        loading={loading}
        equipment={equipment}
        callback={() => {
          getListUnusedEquipment();
          increaseCount();
          getAllNotifications();
        }}
      />
    </div>
  );
};

export default Liquidation;
