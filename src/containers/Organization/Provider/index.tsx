import { useEffect, useState } from 'react';
import {
  DeleteFilled,
  EyeFilled,
  FilterFilled,
  PlusCircleFilled,
  SelectOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import useQuery from 'hooks/useQuery';
import providerApi from 'api/provider.api';
import { toast } from 'react-toastify';
import ExportToExcel from 'components/Excel';
import { resolveDataExcel } from 'utils/globalFunc.util';

const limit: number = 10;

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const Provider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const [providers, setProviders] = useState([]);
  const [page, setPage] = useState<number>(currentPage);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(
    currentName ? false : true
  );
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
      dataIndex: 'image',
      show: false,
      widthExcel: 25,
      render: (item: any) => (
        <img src={image} alt="logo" className="w-20 h-20" />
      ),
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Mã số thuế',
      key: 'tax_code',
      dataIndex: 'tax_code',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Liên hệ',
      key: 'hotline',
      dataIndex: 'hotline',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Người liên hệ',
      key: 'contact_person',
      dataIndex: 'contact_person',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Lĩnh vực hoạt động',
      key: 'services',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>
          {item?.Provider_Services?.map((x: any) => (
            <div>{x?.Service.name}</div>
          ))}
        </>
      ),
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
      show: false,
      widthExcel: 25,
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      show: true,
      widthExcel: 25,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <div>
          <Tooltip title="Chi tiết nhà cung cấp" className="mr-4">
            <Link to={`/organization/provider/detail/${item.id}`}>
              <EyeFilled />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn muốn xóa nhà cung cấp này?"
              onConfirm={() => handleDeleteProvider(item.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteFilled />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  const handleDeleteProvider = (id: number) => {
    providerApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          getAllProviders(currentPage);
          toast.success('Xóa thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    navigate(`${pathName}?page=${page}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} Nhà cung cấp`,
    onChange: onPaginationChange,
  };

  const getAllProviders = async (page: number) => {
    setLoading(true);
    providerApi
      .list(page)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setProviders(data.providers.rows);
          setTotal(data.providers.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAllProviders(page);
  }, [page, currentPage]);

  const searchProviders = async (name: string) => {
    if (name) {
      providerApi
        .search(name)
        .then((res: any) => {
          const { success, data } = res.data;
          if (success) {
            setProviders(data.providers);
          }
        })
        .catch();
    }
  };

  const onChangeSearch = (e: any) => {
    setName(e.target.value);
    if (e.target.value !== '') {
      setShowFooter(false);
      navigate(`${pathName}?keyword=${e.target.value}`);
    } else {
      setShowFooter(true);
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  };

  useEffect(() => {
    searchProviders(nameSearch);
  }, [nameSearch]);

  const onChangeCheckbox = (item: any, e: any) => {
    let newColumns: any = columnTable.map((column: any) => {
      if (item.title === column.title) {
        column.show = e.target.checked;
      }
      return column;
    });
    setColumnTable(newColumns);
  };

  const downloadProviderList = async () => {
    setLoadingDownload(true);
    const res = await providerApi.search(name);
    const { providers } = res?.data?.data;
    const data = providers.map((x: any) => ({
      name: x.name,
      tax_code: x.tax_code,
      email: x.email,
      hotline: x.hotline,
      contact_person: x.contact_person,
      note: x.note,
      address: x.address,
      services: x?.Provider_Services.forEach((item: any) => {
        return `${item?.Service?.name}, `;
      }),
    }));
    resolveDataExcel(data, 'Danh sách nhà cung cấp', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH NHÀ CUNG CẤP</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadProviderList}
            loading={loadingDownload}
          />
          <Button
            className="button_excel"
            onClick={() => navigate('/organization/provider/create')}
          >
            <PlusCircleFilled />
            <div className="font-medium text-md text-[#5B69E6]">Thêm mới</div>
          </Button>
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
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder="Tìm kiếm nhà cung cấp"
            allowClear
            value={name}
            className="rounded-lg h-9 border-[#A3ABEB] border-2"
            onChange={(e) => onChangeSearch(e)}
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={providers}
        className="mt-6 shadow-md"
        footer={() =>
          showFooter && <TableFooter paginationProps={pagination} />
        }
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default Provider;
