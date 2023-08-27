import { useContext, useEffect, useState } from 'react';
import {
  FileExcelFilled, FilterFilled, SelectOutlined, ImportOutlined
} from '@ant-design/icons';
import {
  Button, Divider, Input, Checkbox,
  Select, Table, Row, Pagination,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import image from 'assets/image.png';
import useQuery from 'hooks/useQuery';
import { FilterContext } from 'contexts/filter.context';
import { onChangeCheckbox, options } from 'utils/globalFunc.util';
import supplyApi from 'api/suplly.api';
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

const ListEqCorresponding = () => {

  const { onChangeSearch } = useSearchName();
  const params: any = useParams();
  const { id } = params;
  const navigate = useNavigate();
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
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      show: false,
      render(item: any) {
        return (
          <img src={item?.Equipment?.image || image} alt="logo" className='w-32 h-32' />
        );
      }
    },
    {
      title: 'Mã thiết bị',
      key: 'code',
      show: true,
      render(item: any) {
        return (
          <>{item?.Equipment?.code}</>
        );
      }
    },
    {
      title: 'Tên thiết bị',
      key: 'name',
      show: true,
      render(item: any) {
        return (
          <>{item?.Equipment?.name}</>
        );
      }
    },
    {
      title: 'Model',
      key: 'model',
      show: true,
      render(item: any) {
        return (
          <>{item?.Equipment?.model}</>
        );
      }
    },
    {
      title: 'Serial',
      key: 'serial',
      show: true,
      render(item: any) {
        return (
          <>{item?.Equipment?.serial}</>
        );
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment?.Equipment_Status?.name}</div>
      )
    },
    {
      title: 'Loại thiết bị',
      key: 'type',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment?.Equipment_Type?.name}</div>
      )
    },
    {
      title: 'Đơn vị tính',
      key: 'unit',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment?.Equipment_Unit?.name}</div>
      )
    },
    {
      title: 'Khoa - Phòng',
      key: 'room',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment?.Department?.name}</div>
      )
    },
    {
      title: "Mức độ rủi ro",
      key: "risk_level",
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment?.Equipment_Risk_Level?.name}</div>
      )
    },
    {
      title: "Hãng sản xuất",
      key: "manufacturer_id",
      show: false,
      render(item: any) {
        return (
          <>{item?.Equipment?.manufacturer_id}</>
        );
      }
    },
    {
      title: "Xuất sứ",
      key: "manufacturing_country_id",
      show: false,
      render(item: any) {
        return (
          <>{item?.Equipment?.manufacturing_country_id}</>
        );
      }
    },
    {
      title: "Năm sản xuất",
      key: "year_of_manufacture",
      show: false,
      render(item: any) {
        return (
          <>{item?.Equipment?.year_of_manufacture}</>
        );
      }
    },
    {
      title: "Năm sử dụng",
      key: "year_in_use",
      show: true,
      render(item: any) {
        return (
          <>{item?.Equipment?.year_in_use}</>
        );
      }
    },
    {
      title: "Giá trị ban đầu",
      key: "initial_value",
      show: false,
      render(item: any) {
        return (
          <>{item?.Equipment?.initial_value}</>
        );
      }
    },
    {
      title: "Khấu hao hàng năm",
      key: "annual_depreciation",
      show: false,
      render(item: any) {
        return (
          <>{item?.Equipment?.annual_depreciation}</>
        );
      }
    }
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);

  const onPaginationChange = (page: number) => {
    setPage(page);
    let newSearchQuery: any = { page, ...searchQuery };
    setSearchQuery(newSearchQuery);
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  }

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
  }

  const getEquipements = () => {
    setLoading(true);
    supplyApi.listEqCorresponding({
      page, 
      name, 
      status_id: status, 
      type_id: type, 
      department_id: department, 
      risk_level: level, 
      supply_id: id
    })
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
    getEquipements()
  }, [nameSearch, status, type, department, level, page, id])

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
    if (key === 'risk_level') {
      setLevel(value);
    }
    let newSearchQuery = { ...searchQuery, [`${key}`]: value };
    setSearchQuery(newSearchQuery);
    if (newSearchQuery[`${key}`] === undefined) {
      delete newSearchQuery[`${key}`];
    }
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    if (Object.keys(newSearchQuery)?.length !== 0) {
      navigate(`${pathName}?${searchQueryString}`);
    } else {
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  }

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ TƯƠNG ỨNG VỚI VẬT TƯ</div>
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
    </div >
  )
}

export default ListEqCorresponding