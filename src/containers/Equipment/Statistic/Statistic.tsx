import { FilterFilled, SelectOutlined } from '@ant-design/icons';
import {
  Checkbox,
  Divider,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tabs,
} from 'antd';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import useQuery from 'hooks/useQuery';
import useDebounce from 'hooks/useDebounce';
import { searchByQuery } from './Strategy_Pattern';
import {
  options,
  resolveDataExcel,
} from 'utils/globalFunc.util';
import ExportToExcel from 'components/Excel';
import useSearchName from 'hooks/useSearchName';

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Statistic = ({
  param_string,
  selects,
  title,
  show_tab,
  onChangeTab,
}: any) => {
  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string = location.search.substring(1);
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const currentParam = query[param_string];
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [param, setParam] = useState<any>(currentParam);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      show: false,
      render(item: any) {
        return <img src={image} alt="logo" className="w-32 h-32" />;
      },
    },
    {
      title: 'Mã thiết bị',
      dataIndex: 'code',
      key: 'code',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 35,
    },
    {
      title: 'Model',
      key: 'model',
      dataIndex: 'model',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Serial',
      key: 'serial',
      dataIndex: 'serial',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Trạng thái',
      key: 'status_id',
      show: true,
      widthExcel: 20,
      render: (item: any) => <div>{item?.Equipment_Status?.name}</div>,
    },
    {
      title: 'Loại thiết bị',
      key: 'type_id',
      widthExcel: 30,
      show: true,
      render: (item: any) => <div>{item?.Equipment_Type?.name}</div>,
    },
    {
      title: 'Đơn vị tính',
      key: 'unit_id',
      show: true,
      widthExcel: 20,
      render: (item: any) => <div>{item?.Equipment_Unit?.name}</div>,
    },
    {
      title: 'Khoa - Phòng',
      key: 'department_id',
      widthExcel: 30,
      show: true,
      render: (item: any) => <div>{item?.Department?.name}</div>,
    },
    {
      title: 'Mức độ rủi ro',
      key: 'risk_level',
      widthExcel: 20,
      show: true,
      render: (item: any) => {
        <div>{item?.Equipment_Risk_Level?.name}</div>;
      },
    },
    {
      title: 'Hãng sản xuất',
      key: 'manufacturer_id',
      show: false,
      widthExcel: 25,
      dataIndex: 'manufacturer_id',
    },
    {
      title: 'Xuất sứ',
      key: 'manufacturing_country_id',
      show: false,
      widthExcel: 25,
      dataIndex: 'manufacturing_country_id',
    },
    {
      title: 'Năm sản xuất',
      key: 'year_of_manufacture',
      show: false,
      widthExcel: 20,
      dataIndex: 'year_of_manufacture',
    },
    {
      title: 'Năm sử dụng',
      key: 'year_in_use',
      show: true,
      widthExcel: 20,
      dataIndex: 'year_in_use',
    },
    {
      title: 'Giá trị ban đầu',
      key: 'initial_value',
      show: false,
      widthExcel: 20,
      dataIndex: 'initial_value',
    },
    {
      title: 'Khấu hao hàng năm',
      key: 'annual_depreciation',
      show: false,
      widthExcel: 20,
      dataIndex: 'annual_depreciation',
    },
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);

  const onPaginationChange = (page: number) => {
    const newSearchQuery = { page, ...searchQuery };
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    setPage(page);
    navigate(`${pathName}?${searchQueryString}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
  };

  const search = (name: string, param: any, page: number | undefined) => {
    setLoading(true);
    searchByQuery(name, param, page, param_string)
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
    search(nameSearch, param, page);
  }, [nameSearch, param, page]);

  const onChangeSelect = (value: any) => {
    setParam(value);
    let newSearchQuery = { ...searchQuery, [`${param_string}`]: value };
    setSearchQuery(newSearchQuery);
    if (newSearchQuery[`${param_string}`] === undefined) {
      delete newSearchQuery[`${param_string}`];
    }
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    if (Object.keys(newSearchQuery)?.length !== 0) {
      navigate(`${pathName}?page=${page}&${searchQueryString}`);
    } else {
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const onChangeCheckbox = (item: any, e: any) => {
    let newColumns: any = columnTable.map((column: any) => {
      if (item.title === column.title) {
        column.show = e.target.checked;
      }
      return column;
    });
    setColumnTable(newColumns);
  };

  const downloadEquipmentList = async () => {
    'Danh sách thiết bị';
    setLoadingDownload(true);
    const res = await searchByQuery(name, param, undefined, param_string);
    const { equipments } = res?.data?.data;
    const data = equipments.map((x: any) => ({
      name: x.name,
      code: x.code,
      model: x.model,
      serial: x.serial,
      status_id: x?.Equipment_Status?.name || '',
      type_id: x?.Equipment_Type?.name || '',
      unit_id: x?.Equipment_Unit?.name || '',
      department_id: x?.Department?.name || '',
      risk_level: x?.Equipment_Risk_Level?.name || '',
      manufacturer_id: x.manufacturer_id,
      manufacturing_country_id: x.manufacturing_country_id,
      year_of_manufacture: x.year_of_manufacture,
      year_in_use: x.year_in_use,
      initial_value: x.initial_value,
      annual_depreciation: x.annual_depreciation,
    }));
    resolveDataExcel(data, 'Danh sách thiết bị', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">{`THỐNG KÊ THIẾT BỊ THEO ${title}`}</div>
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
                    onChange={(e: any) => onChangeCheckbox(item, e)}
                  />
                  <div>{item?.title}</div>
                </div>
              ))}
          </div>
        )}
        {show_tab && (
          <Tabs
            defaultActiveKey="1"
            onChange={onChangeTab}
            items={[
              {
                label: `Năm sản xuất`,
                key: '1',
              },
              {
                label: `Năm sử dụng`,
                key: '2',
              },
            ]}
          />
        )}
        <div className="flex-between-center gap-4 p-4">
          <Select
            className="w-1/5"
            showSearch
            placeholder={title}
            optionFilterProp="children"
            onChange={onChangeSelect}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={options(selects)}
            value={param}
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
    </div>
  );
};

export default Statistic;
