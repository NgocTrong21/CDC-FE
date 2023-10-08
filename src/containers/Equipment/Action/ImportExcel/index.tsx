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
  const [status, setStatus] = useState<number>();
  const { departments, statuses } = useContext(FilterContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [equipment, setEquipment] = useState<any>([]);

  const columns: any = [
    // {
    //   title: 'Số thứ tự',
    //   dataIndex: 'line',
    //   key: 'line',
    // },

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
      title: 'Mã hóa TB',
      dataIndex: 'hash_code',
      key: 'hash_code',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
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

    // {
    //   title: 'Hãng sản xuất',
    //   key: 'manufacturer_id',
    //   dataIndex: 'manufacturer_id',
    // },

    // {
    //   title: 'Năm sản xuất',
    //   key: 'year_of_manufacture',
    //   dataIndex: 'year_of_manufacture',
    // },
  ];

  const onChange = (key: string, value: any) => {
    if (key === 'department') {
      setDepartment(value);
    }
    if (key === 'status') {
      setStatus(value);
    }
  };

  const onFinish = () => {
    let n: any = data.map((item: any, index: number) => ({
      line: index + 2,
      ...item,
      department_id: 1,
      status_id: 2,
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
          const hash_code = workSheet[`G${i}`]?.v;
          const quantity = workSheet[`H${i}`]?.v;
          const initial_value = workSheet[`I${i}`]?.v;
          const annual_depreciation = workSheet[`J${i}`]?.v;
          const residual_value = workSheet[`K${i}`]?.v;
          const note = workSheet[`L${i}`]?.v;
          // const manufacturer_id = workSheet[`E${i}`]?.v;
          // const year_of_manufacture = workSheet[`G${i}`]?.v;
          // const warehouse_import_date = new Date(
          //   (workSheet[`I${i}`]?.v - (25567 + 2)) * 86400000
          // ).valueOf();
          // const project_id = workSheet[`J${i}`]?.v;
          // const note = workSheet[`K${i}`]?.v;
          // const technical_parameter = workSheet[`N${i}`]?.v;
          // const configuration = workSheet[`O${i}`]?.v;
          // const import_price = workSheet[`P${i}`]?.v;
          // const risk_level = workSheet[`Q${i}`]?.v;
          // const usage_procedure = workSheet[`R${i}`]?.v;
          // const unit_id = workSheet[`S${i}`]?.v;
          newWorkSheet.push({
            name,
            model,
            serial,
            manufacturing_country_id,
            year_in_use,
            fixed_asset_number,
            hash_code,
            quantity,
            initial_value,
            annual_depreciation,
            residual_value,
            note,
            // manufacturer_id,
            // year_of_manufacture,
            // warehouse_import_date,
            // project_id,
            // note,
            // technical_parameter,
            // configuration,
            // import_price,
            // risk_level,
            // usage_procedure,
            // unit_id,
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
              <Form.Item label="Khoa Phòng" name="department" className="mb-5">
                <Input
                  className="input"
                  defaultValue={
                    options(departments).find((item: any) => item.value === 1)
                      .label
                  }
                  disabled
                />
                {/* <Select
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
                /> */}
              </Form.Item>
              <Form.Item
                label="Trạng thái thiết bị"
                name="status"
                className="mb-5"
              >
                <Input
                  className="input"
                  defaultValue={
                    options(statuses).find((item: any) => item.value === 2)
                      .label
                  }
                  disabled
                />
                {/* <Select
                  showSearch
                  placeholder="Chọn Trạng thái"
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  className="select-custom"
                  options={options(statuses)}
                  onChange={(value: any) => onChange('status', value)}
                /> */}
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
            tin về code hoặc serial với các thiết bị khác trong hệ thống. Vui
            lòng kiểm tra và tạo file excel mới để nhập lại những thiết bị trên.
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
