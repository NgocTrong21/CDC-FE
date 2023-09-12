import {
  CheckCircleFilled,
  EyeFilled,
  FilterFilled,
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
  Table,
  Tooltip,
} from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import ExportToExcel from 'components/Excel';
import useDebounce from 'hooks/useDebounce';
import useQuery from 'hooks/useQuery';
import useSearchName from 'hooks/useSearchName';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { handleReportStatus, onChangeCheckbox, resolveDataExcel } from 'utils/globalFunc.util';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Transfer = () => {
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
      title: 'Khoa - Phòng hiện tại',
      key: 'from_department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return <>{item?.Transfers[0]?.from_department?.name}</>;
      },
    },
    {
      title: 'Khoa - Phòng điều chuyển',
      key: 'to_department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return <>{item?.Transfers[0]?.to_department?.name}</>;
      },
    },
    {
      title: 'Ngày điều chuyển',
      key: 'transfer_date',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>
            {item?.Transfers[0]?.transfer_date &&
              moment(item?.Transfers[0]?.transfer_date).format('DD-MM-YYYY')}
          </>
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      key: 'transfer_status',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{handleReportStatus(item?.Transfers[0]?.transfer_status)}</>
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
          <Menu.Item key="transfer">
            <Tooltip title="Lịch sử điều chuyển">
              <Link to={`/equipment/transfer/history/${item?.id}`}>
                <ProfileFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="transfer">
            <Tooltip title="Phiếu yêu cầu điều chuyển">
              <Link
                to={`/equipment/transfer/detail/${item?.id}/${item?.Transfers[0]?.id}`}
              >
                <CheckCircleFilled />
              </Link>
            </Tooltip>
          </Menu.Item>
        </Menu>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const { onChangeSearch } = useSearchName();
  const query = useQuery();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const currentName = query?.name;
  const currentPage = query?.page;
  const [equipments, setEquipments] = useState<any>([]);
  const [name, setName] = useState<string>(currentName);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const nameSearch = useDebounce(name, 500);

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

  const getList = () => {
    setLoading(true);
    equipmentTransferApi
      .search({ page, name, limit })
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
    getList();
  }, [nameSearch, page, limit]);

  const downloadTransferList = async () => {
    setLoadingDownload(true);
    const res = await equipmentTransferApi.search({ name: nameSearch });
    const { equipments } = res?.data?.data;
    const data = equipments.map((x: any) => ({
      name: x.name,
      code: x.code,
      model: x.model,
      serial: x.serial,
      department: x.Department?.name,
    }));
    resolveDataExcel(data, 'Danh sách điều chuyển thiết bị', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH ĐIỀU CHUYỂN THIẾT BỊ</div>
        <ExportToExcel
          callback={downloadTransferList}
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
    </div>
  );
};

export default Transfer;
