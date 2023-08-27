import { useEffect, useState } from 'react';
import { DashOutlined, DeleteFilled, EditFilled, EyeFilled, FileExcelFilled, FileWordFilled, FilterFilled, ProfileFilled, ToolFilled } from '@ant-design/icons';
import { Button, Divider, Dropdown, Input, Menu, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link } from 'react-router-dom';
import image from 'assets/image.png';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
interface DataType {
  key: string;
  image: string;
  code: string;
  name: string;
  model: string;
  serial: string;
  status: string;
  room: string;
}

const Accreditation = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã thiết bị',
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Khoa - Phòng',
      key: 'department',
      dataIndex: 'department',
    },
    {
      title: 'Chu kỳ kiểm định',
      key: 'cycle',
      dataIndex: 'cylce',
    },
    {
      title: 'Ngày kiểm định lần cuối',
      key: 'lastest_maintenance_date',
      dataIndex: 'lastest_maintenance_date',
    },
    {
      title: 'Ngày kiểm định tiếp theo',
      key: 'next_maintenance_date',
      dataIndex: 'next_maintenance_date',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (item: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="detail">
                <Tooltip title='Hồ sơ thiết bị'>
                  <Link to={`/equipment/detail/${item.key}`}><EyeFilled /></Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="repair">
                <Tooltip title='Lịch sử sửa chữa'>
                  <Link to="/"><ProfileFilled /></Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="word">
                <Tooltip title='In phiếu đề nghị sửa chữa'>
                  <Link to="/"><FileWordFilled /></Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="edit">
                <Tooltip title='Cập nhật trạng thái sửa chữa'>
                  <Link to="/"><ToolFilled /></Link>
                </Tooltip>
              </Menu.Item>
            </Menu>
          }
        >
          <DashOutlined />
        </Dropdown>
      ),
    },
  ];

  const dataSource: DataType[] = [
    {
      key: '1',
      image: '',
      code: 'N01-XXXMXQ-19122021-XX2422',
      name: 'Máy chụp X Quang cao tần VIKOMED',
      model: 'Eva HF-750 Plus',
      serial: 'VKM20034070114',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
    {
      key: '2',
      image: '',
      code: 'N01-XXXMXQ-19122021-XX2423',
      name: 'Máy chụp X Quang di động TOSHIBA',
      model: 'IME - 100L',
      serial: 'W2E1062522',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
    {
      key: '3',
      image: '',
      code: 'N01-XXXMSA-19122021-XX2424',
      name: 'Máy siêu âm den trắng',
      model: 'UF-550XTD -CD',
      serial: '50000284',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
    {
      key: '4',
      image: '',
      code: 'N01-XXXMSA-19122021-XX2424',
      name: 'Máy siêu âm den trắng',
      model: 'UF-550XTD -CD',
      serial: '50000284',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
    {
      key: '5',
      image: '',
      code: 'N01-XXXMSA-19122021-XX2424',
      name: 'Máy siêu âm den trắng',
      model: 'UF-550XTD -CD',
      serial: '50000284',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
    {
      key: '6',
      image: '',
      code: 'N01-XXXMSA-19122021-XX2424',
      name: 'Máy siêu âm den trắng',
      model: 'UF-550XTD -CD',
      serial: '50000284',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
    {
      key: '7',
      image: '',
      code: 'N01-XXXMSA-19122021-XX2424',
      name: 'Máy siêu âm den trắng',
      model: 'UF-550XTD -CD',
      serial: '50000284',
      status: 'Đang sử dụng',
      room: 'Khoa Chẩn đoán hình ảnh',
    },
  ];

  const [equipments, setEquipments] = useState(dataSource);
  const [keyword, setKeyword] = useState<string>("");
  const keywordSearch = useDebounce(keyword, 500);
  const [status, setStatus] = useState<number>(0);
  const [department, setDepartment] = useState<number>();

  const onChange = (key: string, value: string) => {
    console.log(`selected ${value}`);
    console.log("key", key);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const getAllEquipmentRepair = async () => {

  }

  useEffect(() => {
    getAllEquipmentRepair();
  }, []);

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ CẦN KIỂM ĐỊNH</div>
        <div className='flex flex-row gap-6'>
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
          >
            <FileExcelFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
          <Select
            showSearch
            placeholder="Tất cả Trạng thái"
            optionFilterProp="children"
            onChange={(value: string) => onChange('status', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            className="select-custom"
          >
            <Option value="new">Mới</Option>
            <Option value="used">Đang sử dụng</Option>
            <Option value="repair">Đang báo hỏng</Option>
            <Option value="fix">Đang sửa chữa</Option>
            <Option value="unused">Ngừng sử dụng</Option>
            <Option value="liquidated">Đã thanh lý</Option>
          </Select>
          <Select
            showSearch
            placeholder="Khoa - Phòng"
            optionFilterProp="children"
            onChange={(value: string) => onChange('department', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="1">Phòng vật tư</Option>
            <Option value="2">Khoa kiểm soát nhiễm khuẩn</Option>
            <Option value="3">Khoa chuẩn đoán hình ảnh</Option>
          </Select>
          <Select
            showSearch
            placeholder="Nhóm thiết bị"
            optionFilterProp="children"
            onChange={(value: string) => onChange('group', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="4">Thiết bị chuẩn đoán hình ảnh</Option>
            <Option value="5">Thiết bị hồi sức cấp cứu</Option>
            <Option value="6">Thiết bị lọc máu</Option>
          </Select>
          <Select
            showSearch
            placeholder="Loại thiết bị"
            optionFilterProp="children"
            onChange={(value: string) => onChange('type', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="7">Thiết bị phụ trợ chuẩn đoán hình ảnh</Option>
            <Option value="8">Máy X Quang</Option>
            <Option value="9">Máy siêu âm</Option>
          </Select>
          <Select
            showSearch
            placeholder="Chu kỳ kiểm định"
            optionFilterProp="children"
            onChange={(value: string) => onChange('cycle', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="7">Không bắt buộc</Option>
            <Option value="8">12 tháng</Option>
            <Option value="9">24 tháng</Option>
            <Option value="9">36 tháng</Option>
          </Select>
          <Input
            placeholder='Tìm kiếm thiết bị'
            allowClear
            value={keyword}
            className="rounded-lg h-9 border-[#A3ABEB] border-2"
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={equipments} className="mt-6 shadow-md" />
    </div>
  )
}

export default Accreditation