import { useContext, useEffect, useState } from 'react';
import { EyeFilled, FilterFilled, PlusCircleFilled, ProfileFilled, RightCircleFilled, SelectOutlined, ToolFilled } from '@ant-design/icons';
import { Checkbox, Divider, Input, Menu, Pagination, Row, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { FilterContext } from 'contexts/filter.context';
import { getDataExcel, getFields, onChangeCheckbox, options } from 'utils/globalFunc.util';
import moment from 'moment';
import ExportToExcel from 'components/Excel';
import ModalReHandover from 'components/ModalReHandover';
import equipmentRepairApi from 'api/equipment_repair.api';
import { toast } from 'react-toastify';
import useSearchName from 'hooks/useSearchName';
import { broken_status } from 'constants/dataFake.constant';
import { CURRENT_USER } from 'constants/auth.constant';

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify='space-between'>
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const Repair = () => {
  const current_user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '')
  const checkRoleApproveRepair = (): boolean => {
    return current_user?.Role?.Role_Permissions?.find((item: any) => item?.Permission?.name === "repair_equipment.approve")
  }

  const { statuses, departments, types } = useContext(FilterContext);
  const newStatus = statuses.filter((item: any) => item?.id === 4 || item?.id ===5);
  const columns: any = [
    {
      title: 'Tên thiết bị',
      key: 'name',
      show: true,
      widthExcel: 35,
      render: (item: any) => (
        <div>{item?.name}</div>
      )
    },
    {
      title: 'Khoa - Phòng',
      key: 'department',
      show: true,
      widthExcel: 30,
      render: (item: any) => {
        return (
          <div>{item?.Department?.name}</div>
        )
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>{item?.Equipment_Status?.name}</div>
      )
    },
    {
      title: 'Mức độ ưu tiên',
      key: 'repair_priority',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>{broken_status.find((broken_status) => broken_status.value === item?.Repairs[0]?.repair_priority)?.label}</div>
      )
    },
    {
      title: 'Ngày báo hỏng',
      key: 'broken_report_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Repairs[0]?.broken_report_date && moment(item?.Repairs[0]?.broken_report_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày lên lịch sửa chữa',
      key: 'schedule_repair_date',
      show: true,
      widthExcel: 25,
      render: (item: any) => (
        <>{item?.Repairs[0]?.schedule_repair_date && moment(item?.Repairs[0]?.repair_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày sửa chữa',
      key: 'repair_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Repairs[0]?.repair_date && moment(item?.repair_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ngày sửa xong',
      key: 'repair_completion_date',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Repairs[0]?.repair_completion_date && moment(item?.Repairs[0]?.repair_completion_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Chi phí dự kiến',
      key: 'estimated_repair_cost',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Repairs[0]?.estimated_repair_cost}</>
      )
    },
    {
      title: 'Chi phí thực tế',
      key: 'actual_repair_cost',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Repairs[0]?.actual_repair_cost}</>
      )
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
          <Menu.Item key="repair">
            <Tooltip title='Lịch sử sửa chữa'>
              <Link to={`/equipment/repair/history/${item?.id}`}><ProfileFilled /></Link>
            </Tooltip>
          </Menu.Item>
          {
            item?.status_id === 4 &&
            <Menu.Item key="word">
              <Tooltip title='Tạo lịch sửa chữa'>
                <Link to={`/equipment/repair/create_schedule/${item?.id}/${item?.Repairs[0]?.id}`}><PlusCircleFilled /></Link>
              </Tooltip>
            </Menu.Item>
          }
          {
            item?.status_id === 5 && checkRoleApproveRepair() &&
            <Menu.Item key="edit">
              <Tooltip title='Cập nhật trạng thái sửa chữa'>
                <Link to={`/equipment/repair/update_schedule/${item?.id}/${item?.Repairs[0]?.id}`}><ToolFilled /></Link>
              </Tooltip>
            </Menu.Item>
          }
          {
            (item?.Repairs[0]?.repair_status === 3 || item?.Repairs[0]?.repair_status === 4) &&
            <Menu.Item key="rehandover">
              <Tooltip title='Bàn giao lại thiết bị'>
                <RightCircleFilled onClick={() => setReHandoverFields(item)} />
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
  const [loadingReHandover, setLoadingReHandover] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage || 1);
  const nameSearch = useDebounce(name, 500);
  const [showReHandoverModal, setShowReHandoverModal] = useState<boolean>(false);
  const [equipment, setEquipment] = useState({});

  const setReHandoverFields = (item: any) => {
    setShowReHandoverModal(true);
    setEquipment({
      id: item?.id,
      name: item?.name,
      department_id: item?.Department?.id,
      department_name: item?.Department?.name,
      repair_status: item?.Repairs[0]?.repair_status,
    })
  }

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
  }

  const onPaginationChange = (page: number) => {
    setPage(page);
    searchQuery.page = page;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  }

  const getAllEquipmentRepair = (page: number, name: string, status_id: any,
    type_id: any, department_id: any) => {
    setLoading(true);
    equipmentRepairApi.getBrokenAndRepairEqList({page, name, status_id, type_id, department_id})
      .then((res: any) => {
        const { success, data } = res.data;  
        if (success) {
          setEquipments(data.equipments.rows.reverse());         
          setTotal(data.equipments.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAllEquipmentRepair(page, nameSearch, status, type, department)
  }, [nameSearch, status, type, department, page])

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
  }

  const downloadRepairList = () => {
    let fields = getFields(columnTable);
    let data = equipments
      .map((x: any) => ({
        name: x?.Equipment?.name,
        department: x?.Equipment?.Department?.name,
        status: x?.Equipment?.Equipment_Status?.name || '',
        repair_priority: x.repair_priority,
        broken_report_date: x?.broken_report_date && moment(x?.broken_report_date).format("DD-MM-YYYY"),
        schedule_repair_date: x?.schedule_repair_date && moment(x?.schedule_repair_date).format("DD-MM-YYYY"),
        repair_date: x?.repair_date && moment(x?.repair_date).format("DD-MM-YYYY"),
        repair_completion_date: x?.repair_completion_date && moment(x?.repair_completion_date).format("DD-MM-YYYY"),
        estimated_repair_cost: x?.estimated_repair_cost,
        actual_repair_cost: x?.actual_repair_cost
      }))
    let objectKey = Object.keys(data[0]);
    let newData: any = getDataExcel(data, objectKey, fields);
    const workSheetColumnName = fields?.map((item: any) => ({ title: item?.title, width: item?.width }));
    const workSheetName = 'Danh sách thiết bị';
    const fileName = `Danh sách thiết bị đang báo hỏng và sửa chữa ${new Date().toISOString().substring(0, 10)}.xlsx`;
    const finalData: any = [workSheetColumnName, ...newData];

    return {
      data: finalData,
      sheetName: workSheetName,
      fileName,
      headerName: workSheetName
    }
  }

  const reHandover = (values: any, equipment: any, brokenFile: any, repairFile: any) => {
    const data = {
      ...values,
      equipment_id: equipment?.id,
      equipment_name: equipment?.name,
      department_id: equipment?.department_id,
      department_name: equipment?.department_name,
      brokenFile,
      repairFile
    }
    setLoadingReHandover(true);
    equipmentRepairApi.reHandover(data)
      .then((res: any) => {
        const { success } = res.data;
        if(success) {
          toast.success("Bàn giao thành công!");
          setShowReHandoverModal(false);
          getAllEquipmentRepair(page, nameSearch, status, type, department)
        } else {
          toast.error("Bàn giao thất bại!");
        }
      })
      .catch()
      .finally(() =>  setLoadingReHandover(false))
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ ĐANG BÁO HỎNG VÀ SỬA CHỮA</div>
        <ExportToExcel getData={downloadRepairList} />
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
          <Select
            showSearch
            placeholder="Tất cả Trạng thái"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('status_id', value)}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(newStatus)}
            className="select-custom"
          />
          <Select
            showSearch
            placeholder="Khoa - Phòng"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('department_id', value)}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(departments)}
            value={department}
          />
          <Select
            showSearch
            placeholder="Loại thiết bị"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('type_id', value)}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            options={options(types)}
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
      <ModalReHandover
        equipment={equipment}
        showReHandoverModal={showReHandoverModal}
        setShowReHandoverModal={() => setShowReHandoverModal(false)}
        loadingReHandover={loadingReHandover}
        reHandover={reHandover}
      />
    </div>
  )
}

export default Repair
