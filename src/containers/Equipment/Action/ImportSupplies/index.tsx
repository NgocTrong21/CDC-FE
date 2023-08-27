import { FilterFilled, SelectOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Divider, Input,
  Pagination, Row, Select, Table
} from 'antd'
import { useState, useEffect, useContext } from 'react'
import image from 'assets/image.png';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import useDebounce from 'hooks/useDebounce';
import supplyApi from 'api/suplly.api';
import { toast } from 'react-toastify';
import { onChangeCheckbox, options } from 'utils/globalFunc.util';
import categoryApi from 'api/category.api';
import { FilterContext } from 'contexts/filter.context';
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

const ImportSupplies = () => {

  const params: any = useParams();
  const { id } = params;
  const { levels } = useContext(FilterContext);
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState<any>([]);
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
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentLevel);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [types, setTypes] = useState<any>([]);
  const [supplyIds, setSupplyIds] = useState<any>([]);
  const { onChangeSearch } = useSearchName();

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
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
      show: true,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      show: true,
    },
    {
      title: 'Loại vật tư',
      show: true,
      render: (item: any) => (
        <div>{item?.Supply_Type?.name}</div>
      )
    },
    {
      title: 'Đơn vị tính',
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Unit?.name}</div>
      )
    },
    {
      title: "Mức độ rủi ro",
      show: true,
      render: (item: any) => (
        <div>{item?.Equipment_Risk_Level?.name}</div>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      show: true,
    },
    {
      title: "Hãng sản xuất",
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
      show: true,
      dataIndex: 'year_of_manufacture',
    },
    {
      title: "Năm sử dụng",
      show: false,
      dataIndex: 'year_in_use',
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
  }

  const getSuppliesList = () => {
    setLoading(true);
    supplyApi.list({
      page,
      name,
      type_id: type,
      risk_level: level
    })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          let supplies = data?.supplies?.rows;
          let x: any = supplies?.map((item: any) => ({ ...item, key: item?.id?.toString(), count_supply: 1, count_error: false }))
          setSupplies(x);
          setTotal(data?.supplies?.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getSuppliesList();
  }, [page, nameSearch, type, level])

  const onChangeSelect = (key: string, value: any) => {
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

  // const listSupplyOfEq = (page: number, equipment_id: number) => {
  //   supplyApi.listSupplyOfEq(page, equipment_id)
  //     .then((res: any) => {
  //       const { success, data } = res?.data;
  //       if (success) {
  //         let x = data.supplies.rows?.map((item: any) => item.Supply);
  //         setSupplies(x)
  //       }
  //     })
  //     .catch()
  // }

  // const listSupplyIds = (page: number, equipment_id: number) => {
  //   supplyApi.listSupplyOfEq(page, equipment_id)
  //     .then((res: any) => {
  //       const { success, data } = res?.data;
  //       if (success) {
  //         let x = data.supplies.rows?.map((item: any) => item.Supply.id.toString());
  //         setSupplyIds(x)
  //       }
  //     })
  //     .catch()
  // }

  // const handleCheckbox = (e: any) => {
  //   const { checked } = e.target;
  //   if (checked) {
  //     listSupplyOfEq(page, id);
  //   } else {
  //     getSuppliesList();
  //   }
  // }

  // useEffect(() => {
  //   listSupplyIds(1, id);
  // }, [id])

  const rowSelection: any = {
    onChange: (selectedRowKeys: any) => {
      setSupplyIds(selectedRowKeys)
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.count === 0
    }),
    selectedRowKeys: supplyIds,
    preserveSelectedRowKeys: true,
  };


  const handleImport = () => {
    const suppliesData = supplies
      .filter((supply: any) => supply.count_error === false)
      .filter((supply: any) => supplyIds.some((id: any) => supply.id === +id))
      .map((item: any) => ({ supply_id: item.id, count_supply: item.count_supply }))
    let data = {
      equipment_id: id,
      supplies: suppliesData
    }
    setLoading(true);
    supplyApi.importSuppliesForEquipment(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success("Nhật vật tư thành công!");
          navigate(`/equipment/detail/${id}`);
        } else {
          toast.error("Nhập vật tư thất bại!")
        }
      })
      .catch(() => toast.error("Nhập vật tư thất bại!"))
      .finally(() => setLoading(false))
  }

  const onChangeCountSupply = (record: any, e: any) => {
    let newData = supplies.map((item: any) => {
      if (item.id === record.id) {
        if (+e.target.value > record.count) {
          item.count_error = true;
        } else {
          item.count_error = false;
        }
        item.count_supply = +e.target.value
      }
      return item;
    });
    setSupplies(newData);
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP VẬT TƯ</div>
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
        {/* <div className='flex gap-2 items-center'>
          <Checkbox onChange={(e: any) => handleCheckbox(e)} />
          <div className='font-medium text-center cursor-pointer text-base'>Danh sách vật tư của thiết bị</div>
        </div> */}
      </div>
      <Table
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columnTable.filter((item: any) => item.show)}
        expandable={{
          expandedRowRender: (record: any) =>
            <div className='flex gap-4'>
              <div>Nhập số lượng vật tư</div>
              <div>
                <Input defaultValue={record.count_supply || 0} onChange={(e: any) => onChangeCountSupply(record, e)} className='w-20' />
                {record.count_error && <div className='text-red-600'>Bạn đã nhập quá số lượng vật tư cho phép </div>}
              </div>

            </div>,
          rowExpandable: (record) => record.count !== 0,
        }}
        dataSource={supplies}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
      <div>
        <Button loading={loading} onClick={() => handleImport()} className='button mt-10'>Cập nhật</Button>
      </div>
    </div >
  )
}

export default ImportSupplies