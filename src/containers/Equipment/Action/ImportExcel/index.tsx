import { useContext, useState } from 'react';
import { FileExcelFilled } from '@ant-design/icons';
import { Button, Divider, Form, Input, Select, Table } from 'antd';
import { toast } from 'react-toastify';
import * as xlsx from 'xlsx';
import { FilterContext } from 'contexts/filter.context';
import equipmentApi from 'api/equipment.api';
import EquipmentImportFileExcel from 'components/EquipmentImportFileExcel';
import { options } from 'utils/globalFunc.util';

const ImportEquipmentByExcel = () => {
  const [department, setDepartment] = useState<number>();
  const { departments, statuses, units } = useContext(FilterContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [equipment, setEquipment] = useState<any>([]);
  const columns: any = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Model',
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: 'Serial',
      key: 'serial',
      dataIndex: 'serial',
    },
    {
      title: 'Nước sản xuất',
      key: 'manufacturing_country_id',
      dataIndex: 'manufacturing_country_id',
    },
    {
      title: 'Năm sử dụng',
      key: 'year_in_use',
      dataIndex: 'year_in_use',
    },
    {
      title: 'Số hiệu TSCĐ',
      key: 'fixed_asset_number',
      dataIndex: 'fixed_asset_number',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit_id',
      key: 'unit_id',
    },
    {
      title: 'Giá trị',
      key: 'initial_value',
      dataIndex: 'initial_value',
    },
    {
      title: 'Khấu hao hàng năm',
      key: 'annual_depreciation',
      dataIndex: 'annual_depreciation',
    },
    {
      title: 'Giá trị còn lại',
      key: 'residual_value',
      dataIndex: 'residual_value',
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
    },
  ];

  const onChange = (key: string, value: any) => {
    if (key === 'department') {
      setDepartment(value);
    }
  };

  const onFinish = () => {
    let n: any = data.map((item: any, index: number) => ({
      line: index + 2,
      ...item,
      department_id: department,
      status_id: 3,
    }));
    setLoading(true);
    equipmentApi
      .uploadExcel(n)
      .then((res: any) => {
        const { success, message, data } = res.data;
        if (success) {
          toast.success('Nhập danh sách thiết bị thành công!');
          setEquipment(data.duplicateArray);
          form.resetFields();
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  const readUploadFile = (e: any) => {
    let newWorkSheet: any = [];
    e.preventDefault();
    if (
      e?.target?.files[0]?.type !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      form.resetFields(['excel']);
      form.setFields([
        {
          name: 'excel',
          errors: ['Vui lòng chọn đúng định dạng file excel!'],
        },
      ]);
      return;
    }
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data: any = e?.target?.result;
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(workSheet);
        for (let i = 2; i <= json?.length + 1; i++) {
          const name = workSheet[`A${i}`]?.v;
          const model = workSheet[`B${i}`]?.v;
          const serial = workSheet[`C${i}`]?.v;
          const manufacturing_country_id = workSheet[`D${i}`]?.v;
          const year_in_use = workSheet[`E${i}`]?.v;
          const fixed_asset_number = workSheet[`F${i}`]?.v;
          const unit_id = (
            units.find(
              (item: any) => item?.name === workSheet[`G${i}`]?.v
            ) as any
          )?.id;
          const initial_value = workSheet[`H${i}`]?.v;
          const annual_depreciation = workSheet[`I${i}`]?.v;
          const residual_value = workSheet[`J${i}`]?.v;
          const note = workSheet[`K${i}`]?.v;
          newWorkSheet.push({
            name,
            model,
            serial,
            manufacturing_country_id,
            year_in_use,
            fixed_asset_number,
            unit_id,
            initial_value,
            annual_depreciation,
            residual_value,
            note,
          });
        }
        setData(newWorkSheet);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP THIẾT BỊ TỪ EXCEL</div>
        <div className="flex flex-row gap-6">
          <EquipmentImportFileExcel />
        </div>
      </div>
      <Divider />
      <Form
        className="grid grid-cols-2 gap-20"
        onFinish={onFinish}
        form={form}
        layout="vertical"
      >
        <div>
          <div className="mb-6 text-center text-lg font-semibold">Thao tác</div>
          <Form.Item
            className="fileUploadInput"
            name="excel"
            label="Chọn file"
            required
            rules={[{ required: true, message: 'Hãy chọn file excel!' }]}
          >
            <Input
              type="file"
              placeholder="Chọn file excel"
              onChange={(e: any) => readUploadFile(e)}
            />
          </Form.Item>
          <Form.Item className="mt-6">
            <Button
              htmlType="submit"
              className="button_excel"
              loading={loading}
            >
              <FileExcelFilled />
              <div className="font-medium text-md text-[#5B69E6]">
                Nhập Excel
              </div>
            </Button>
          </Form.Item>
        </div>
        <div>
          <div className="mb-6 text-center text-lg font-semibold">
            Thông số chung
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Khoa Phòng"
                name="department"
                className="mb-5"
                required
                rules={[{ required: true, message: 'Hãy chọn khoa phòng!' }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn Khoa - Phòng"
                  optionFilterProp="children"
                  allowClear
                  virtual
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={options(departments)}
                  onChange={(value: any) => onChange('department', value)}
                />
              </Form.Item>
              <Form.Item
                label="Trạng thái thiết bị"
                name="status"
                className="mb-5"
              >
                <Input
                  className="input"
                  defaultValue={
                    options(statuses).find((item: any) => item.value === 3)
                      .label
                  }
                  disabled
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
      <Divider />
      {equipment.length > 0 && (
        <>
          <div className="italic text-red-600">
            * Những thiết bị có số thứ tự sau trong file excel đã bị trùng thông
            tin về số hiệu TSCĐ với các thiết bị khác trong hệ thống. Vui lòng
            kiểm tra và tạo file excel mới để nhập lại những thiết bị trên.
          </div>
          <Table
            columns={columns}
            dataSource={equipment}
            className="mt-6 shadow-md"
            pagination={false}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default ImportEquipmentByExcel;
