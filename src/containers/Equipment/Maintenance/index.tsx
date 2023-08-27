import { useEffect, useState, useContext } from 'react';
import { EyeFilled, FileExcelFilled, FileWordFilled, FilterFilled, ProfileFilled, ToolFilled } from '@ant-design/icons';
import { Button, Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link } from 'react-router-dom';
import { FilterContext } from 'contexts/filter.context';
import { options } from 'utils/globalFunc.util';

const Maintenance = () => {

  const { statuses, departments } = useContext(FilterContext);
  const columns: any = [
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
      title: 'Chu kỳ bảo dưỡng',
      key: 'cycle',
      dataIndex: 'cylce',
    },
    {
      title: 'Ngày bảo dưỡng lần cuối',
      key: 'lastest_maintenance_date',
      dataIndex: 'lastest_maintenance_date',
    },
    {
      title: 'Ngày bảo dưỡng tiếp theo',
      key: 'next_maintenance_date',
      dataIndex: 'next_maintenance_date',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      render: (item: any) => (
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
      ),
    },
  ];

  const [equipments, setEquipments] = useState([]);
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
        <div className="title">DANH SÁCH THIẾT BỊ CẦN BẢO DƯỠNG, BẢO TRÌ</div>
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
            options={options(statuses)}
          />
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
            options={options(departments)}
          />
          <Input
            placeholder='Tìm kiếm thiết bị'
            allowClear
            value={keyword}
            className="input"
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

export default Maintenance