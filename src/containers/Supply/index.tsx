import { 
  DeleteFilled, EditFilled, EyeFilled, 
  FileExcelFilled, FilterFilled, ImportOutlined, 
  SelectOutlined, SwapOutlined } 
from '@ant-design/icons';
import { 
  Button, Checkbox, Divider, Input, 
  Menu, Pagination, Popconfirm, Row, 
  Select, Table, Tooltip } 
from 'antd'
import { useState, useEffect, useContext } from 'react'
import image from 'assets/image.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import useDebounce from 'hooks/useDebounce';
import supplyApi from 'api/suplly.api';
import { toast } from 'react-toastify';
import { onChangeCheckbox, options } from 'utils/globalFunc.util';
import categoryApi from 'api/category.api';
import { FilterContext } from 'contexts/filter.context';
import useSearchName from 'hooks/useSearchName';
import type { PaginationProps } from 'antd';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify='space-between'>
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const Suplly = () => {

  const { onChangeSearch } = useSearchName();
  const { levels } = useContext(FilterContext);
  const navigate = useNavigate();
  const [supllies, setSupplies] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const currentType = query?.type_id;
  const currentLevel = query?.risk_level;
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentLevel);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [types, setTypes] = useState<any>([]);

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
      show: false,
      render(item: any) {
        return (
          <img src={item?.image || image} alt="logo" className='w-32 h-32' />
        );
      }
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'code',
      key: 'code',
      show: true,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
      show: true,
    },
    {
      title: 'Loại vật tư',
      key: 'type',
      show: true,
      render: (item: any) => (
        <div>{item?.Supply_Type?.name}</div>
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
      title: "Mức độ rủi ro",
      key: "risk_level",
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Risk_Level?.name}</div>
      )
    },
    {
      title: "Số lượng",
      key: "count",
      dataIndex: "count",
      show: true,
    },
    {
      title: "Hãng sản xuất",
      key: "manufacturer",
      show: false,
      dataIndex: 'manufacturer',
    },
    {
      title: "Xuất sứ",
      key: "manufacturing_country",
      show: false,
      dataIndex: 'manufacturing_country',
    },
    {
      title: "Năm sản xuất",
      key: "year_of_manufacture",
      show: true,
      dataIndex: 'year_of_manufacture',
    },
    {
      title: "Năm sử dụng",
      key: "year_in_use",
      show: false,
      dataIndex: 'year_in_use',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className='flex flex-row items-center'>
          <Menu.Item key="equipment">
            <Tooltip title="Thiết bị tương thích">
              <Link  to={`/supplies/list_equipment_corresponding/${item.id}`}><SwapOutlined /></Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="detail">
            <Tooltip title="Hồ sơ vật tư">
              <Link to={`/supplies/detail/${item.id}`}><EyeFilled /></Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="update_supplies">
            <Tooltip title="Cập nhật vật tư">
              <Link to={`/supplies/update/${item.id}`}><EditFilled /></Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="delete">
            <Tooltip title="Xóa vật tư">
              <Popconfirm
                title="Bạn muốn xóa vật tư này?"
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
  }

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange
  }

  const handleDelete = (id: number) => {
    supplyApi.delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          getSuppliesList();
          toast.success("Xóa thành công!");

        } else {
          toast.error(message);
        }
      })
      .catch(error => toast.error(error))
  }

  const getSuppliesList = () => {
    setLoading(true);
    supplyApi.list({
      page,
      limit,
      name,
      type_id: type,
      risk_level: level
    })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(data.supplies.rows);
          setTotal(data.supplies.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getSuppliesList();
  }, [page, nameSearch, type, level, limit])


  const onChangeSelect = (key: string, value: any) => {
    setPage(1);
    if (key === 'type_id') {
      setType(value);
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

  const getSupplyType = () => {
    categoryApi.listSypplyType()
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setTypes(data?.supply_types)
        }
      })
      .catch()
  }
  useEffect(() => {
    getSupplyType();
  }, [])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH VẬT TƯ</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
          >
            <FileExcelFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
          </Button>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate("/supplies/import_excel_sp")}
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
            placeholder="Loại vật tư"
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
          <Input
            placeholder='Tìm kiếm vật tư'
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
        dataSource={supllies}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />

    </div >
  )
}

export default Suplly