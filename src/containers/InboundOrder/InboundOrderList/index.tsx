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
  RightCircleFilled,
  PlusSquareFilled,
  RetweetOutlined,
  PlusCircleFilled,
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import equipmentApi from 'api/equipment.api';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import { NotificationContext } from 'contexts/notification.context';
import ModalHandover from 'components/ModalHandover';
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
import Item from 'antd/lib/list/Item';
import { formatCurrency } from 'utils/globalFunc.util';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const InboundOrderList = () => {
  const navigate = useNavigate();
  const { increaseCount, getAllNotifications } =
    useContext(NotificationContext);
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
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [status, setStatus] = useState<any>(currentStatus);
  const [department, setDepartment] = useState<any>(currentDepartment);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentRiskLevel);
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [dataHandover, setDataHandover] = useState<any>({});
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
      title: 'Mã phiếu',
      dataIndex: 'name',
      key: 'order_code',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Số phiếu',
      key: 'order_number',
      dataIndex: 'model',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Ngày tạo',
      key: 'created_date',
      show: true,
      dataIndex: 'created_date',
      widthExcel: 30,
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider',
      show: true,
      dataIndex: 'provider',
      widthExcel: 30,
    },
    {
      title: 'Kho hàng',
      key: 'ware_house',
      show: true,
      dataIndex: 'ware_house',
      widthExcel: 30,
    },
    {
      title: 'Người giao hàng',
      dataIndex: 'deliverer',
      key: 'deliverer',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className="flex flex-row items-center">
          {item?.Equipment_Status?.id !== 7 && (
            <Menu.Item
              key="update_equipment"
              className={`${
                checkPermission(permissions.EQUIPMENT_UPDATE) ? '' : 'hidden'
              }`}
            >
              <Tooltip title="Cập nhật phiếu">
                <Link to={`/order/outbound_order/update/${item.id}`}>
                  <EditFilled />
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
            <Tooltip title="Xóa phiếu">
              <Popconfirm
                title="Bạn muốn xóa phiếu này?"
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
    showTotal: (total: number) => `Tổng cộng: ${total} phiếu`,
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

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH PHIẾU NHẬP</div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div>
        <Button
          className="button_excel"
          onClick={() => {
            navigate('/order/inbound_order/import');
          }}
        >
          <PlusCircleFilled />
          <div className="font-medium text-md text-[#5B69E6]">
            Tạo phiếu nhập mới
          </div>
        </Button>
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
          search();
        }}
        dataHandover={dataHandover}
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

export default InboundOrderList;
