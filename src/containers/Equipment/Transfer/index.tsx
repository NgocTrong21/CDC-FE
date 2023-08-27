import { CheckCircleFilled, EyeFilled, FileWordFilled, FilterFilled, ProfileFilled, SelectOutlined } from '@ant-design/icons'
import { Checkbox, Divider, Input, Menu, Pagination, Row, Table, Tooltip } from 'antd'
import equipmentTransferApi from 'api/equipment_transfer.api'
import ExportToExcel from 'components/Excel'
import ModalTransferApprove from 'components/ModalTransferApprove'
import { transfer_status } from 'constants/dataFake.constant'
import { FilterContext } from 'contexts/filter.context'
import useDebounce from 'hooks/useDebounce'
import useQuery from 'hooks/useQuery'
import useSearchName from 'hooks/useSearchName'
import moment from 'moment'
import { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { downloadTransferDocx } from 'utils/file.util'
import { getDataExcel, getFields, onChangeCheckbox } from 'utils/globalFunc.util'

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify='space-between'>
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const Transfer = () => {

  const columns: any = [
    {
      title: 'Tên thiết bị',
      key: 'name',
      show: true,
      widthExcel: 35,
      render: (item: any) => (
        <>{item?.Equipment?.name}</>
      )
    },
    {
      title: 'Code',
      key: 'code',
      show: true,
      widthExcel: 35,
      render: (item: any) => (
        <>{item?.Equipment?.code}</>
      )
    },
    {
      title: 'Model',
      key: 'model',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>{item?.Equipment?.model}</>
      )
    },
    {
      title: 'Serial',
      key: 'serial',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>{item?.Equipment?.serial}</>
      )
    },
    {
      title: 'Khoa - Phòng hiện tại',
      key: 'from_department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.from_department?.name}</>
        )
      }
    },
    {
      title: 'Khoa - Phòng điều chuyển',
      key: 'to_department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.to_department?.name}</>
        )
      }
    },
    {
      title: 'Người tạo phiếu',
      key: 'transfer_create_user',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.transfer_create_user?.name}</>
        )
      }
    },
    {
      title: 'Ngày tạo phiếu',
      key: 'transfer_date',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.transfer_date && moment(item?.transfer_date).format("DD-MM-YYYY")}</>
        )
      }
    },
    {
      title: 'Người phê duyệt',
      key: 'transfer_approver',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{item?.transfer_approver?.name}</>
        )
      }
    },
    {
      title: 'Trạng thái xử lý',
      key: 'transfer_status',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <>{handleLiquidationStatus(item?.transfer_status)}</>
        )
      }
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className='flex flex-row'>
          <Menu.Item key="detail">
            <Tooltip title='Hồ sơ thiết bị'>
              <Link to={`/equipment/detail/${item?.id}`}><EyeFilled /></Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="transfer">
            <Tooltip title='Phiếu yêu cầu điều chuyển'>
              <Link to={`/equipment/transfer_detail/${item?.equipment_id}`}><ProfileFilled /></Link>
            </Tooltip>
          </Menu.Item>
          {
            item?.transfer_status === 0 &&
            <Menu.Item key="approver">
              <Tooltip title='Phê duyệt'>
                <CheckCircleFilled onClick={() => setTransferFields(item)} />
              </Tooltip>
            </Menu.Item>
          }
          {
            item?.transfer_status === 1 &&
            <Menu.Item key="word">
              <Tooltip title='Biên bản điều chuyển'>
                <FileWordFilled onClick={() => handleDownloadTransferData(item)} />
              </Tooltip>
            </Menu.Item>
          }
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
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage || 1);
  const nameSearch = useDebounce(name, 500);
  const [showTransferApproveModal, setShowTransferApproveModal] = useState<boolean>(false);
  const { user } = useContext(FilterContext);
  const [dataTransfer, setDataTransfer] = useState<any>({});

  const handleDownloadTransferData = (item: any) => {
    let data = {
      name: item?.Equipment?.name,
      model: item?.Equipment?.model,
      serial: item?.Equipment?.serial,
      from_department: item?.from_department?.name,
      to_department: item?.to_department?.name,
      transfer_date: moment(item?.transfer_date).format("DD-MM-YYYY"),
      transfer_create_user: item?.transfer_create_user?.name,
      transfer_approver: item?.transfer_approver?.name,
      note: item?.note
    }
    downloadTransferDocx(data);
  }

  const handleLiquidationStatus = (status: any) => {
    return transfer_status.filter((item: any) => item.value === status)[0]?.label;
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

  const getList = (page: number, name: string) => {
    setLoading(true);
    equipmentTransferApi.list({page, name})
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipments(data.equipments.rows);
          setTotal(data.equipments.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getList(page, nameSearch)
  }, [nameSearch, page])

  const setTransferFields = (item: any) => {
    setShowTransferApproveModal(true);
    setDataTransfer({
      id: item?.id,
      equipment_id: item?.equipment_id,
      equipment_name: item?.Equipment?.name,
      approver_id: user.id,
      approver_name: user.name,
      from_department_id: item?.from_department?.id,
      to_department_id: item?.to_department?.id,
      from_department: item?.from_department?.name,
      to_department: item?.to_department?.name,
    })
  }

  const downloadTransferList = () => {
    let fields: any = getFields(columnTable);
    let data = equipments
      .map((x: any) => ({
        name: x.name,
        code: x.code,
        model: x.model,
        serial: x.serial,
        department: x.Department?.name
      }))
    let objectKey = Object.keys(data[0]);
    let newData: any = getDataExcel(data, objectKey, fields);
    const workSheetColumnName = fields?.map((item: any) => ({ title: item?.title, width: item?.width }));
    const workSheetName = 'Danh sách điều chuyển thiết bị';
    const fileName = `Danh sách điều chuyển thiết bị ${new Date().toISOString().substring(0, 10)}.xlsx`;
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
        <div className="title">DANH SÁCH ĐIỀU CHUYỂN THIẾT BỊ</div>
        <ExportToExcel getData={downloadTransferList} />
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
      </div>
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
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
      <ModalTransferApprove
        showTransferApproveModal={showTransferApproveModal}
        setShowTransferApproveModal={() => setShowTransferApproveModal(false)}
        dataTransfer={dataTransfer}
        callback={() => {
          getList(page, name)
        }}
      />
    </div>
  )
}

export default Transfer