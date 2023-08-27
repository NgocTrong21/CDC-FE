import { useContext, useState } from 'react';
import { FileExcelFilled } from '@ant-design/icons';
import { Button, Divider, Form, Input, Select } from 'antd';
import { toast } from 'react-toastify';
import * as xlsx from 'xlsx';
import { FilterContext } from 'contexts/filter.context';
import equipmentApi from 'api/equipment.api';
import EquipmentImportFileExcel from 'components/EquipmentImportFileExcel';

const ImportEquipmentByExcel = () => {

  const [department, setDepartment] = useState<number>();
  const [status, setStatus] = useState<number>();
  const { departments, statuses } = useContext(FilterContext);
  const options = (array: any) => {
    return array.map((item: any) => {
      let o: any = {};
      o.value = item.id;
      o.label = item.name;
      return o;
    })
  }
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);

  const onChange = (key: string, value: any) => {
    if (key === 'department') {
      setDepartment(value);
    }
    if (key === 'status') {
      setStatus(value);
    }
  }

  const onFinish = () => {
    let n: any = data.map((item: any) => (
      {
        ...item,
        department_id: department,
        status_id: status
      }
    ))
    equipmentApi.uploadExcel(n)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Nhập danh sách thiết bị thành công!');
          form.resetFields();
        } else {
          toast.error(message);
        }
      })
      .catch()
  }

  const readUploadFile = (e: any) => {
    let newWorkSheet: any = [];
    e.preventDefault();
    
    
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data: any = e?.target?.result;
        const workbook = xlsx.read(data, { type: "array" });
        console.log("check e", workbook);
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(workSheet);
        for (let i = 2; i <= json?.length + 1; i++) {
          const name = workSheet[`A${i}`]?.v;
          const code = workSheet[`B${i}`]?.v;
          const model = workSheet[`C${i}`]?.v;
          const serial = workSheet[`D${i}`]?.v;
          const manufacturer_id = workSheet[`E${i}`]?.v;
          const manufacturing_country_id = workSheet[`F${i}`]?.v;
          const year_of_manufacture = workSheet[`G${i}`]?.v;
          const year_in_use = workSheet[`H${i}`]?.v;
          const warehouse_import_date = new Date((workSheet[`I${i}`]?.v - (25567 + 2))*86400000).valueOf();
          const project_id = workSheet[`J${i}`]?.v;
          const note = workSheet[`K${i}`]?.v;
          const initial_value = workSheet[`L${i}`]?.v;
          const annual_depreciation = workSheet[`M${i}`]?.v;
          const technical_parameter = workSheet[`N${i}`]?.v;
          const configuration = workSheet[`O${i}`]?.v;
          const import_price = workSheet[`P${i}`]?.v;
          const risk_level = workSheet[`Q${i}`]?.v;
          const usage_procedure = workSheet[`R${i}`]?.v;
          const unit_id = workSheet[`S${i}`]?.v;
          newWorkSheet.push({
            name,
            code,
            model,
            serial,
            manufacturer_id,
            manufacturing_country_id,
            year_in_use,
            year_of_manufacture,
            warehouse_import_date,
            project_id,
            note,
            initial_value,
            annual_depreciation,
            technical_parameter,
            configuration,
            import_price,
            risk_level,
            usage_procedure,
            unit_id
          })
        }
        setData(newWorkSheet);
        
        
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  console.log('check data', data);
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP THIẾT BỊ TỪ EXCEL</div>
        <div className='flex flex-row gap-6'>
          <EquipmentImportFileExcel />
        </div>
      </div>
      <Divider />
      <Form
        className="grid grid-cols-2 gap-20"
        onFinish={onFinish}
        form={form}
        layout='vertical'
      >
        <div>
          <div className='mb-6 text-center text-lg font-semibold'>Thao tác</div>
          <Form.Item
            className="fileUploadInput"
            name="excel"
            label="Chọn file"
            required
            rules={[{ required: true, message: 'Hãy chọn file excel!' }]}
          >
            <Input
              type="file"
              placeholder='Chọn file excel'
              onChange={(e: any) => readUploadFile(e)}
            />
          </Form.Item>
          <Form.Item className='mt-6'>
            <Button htmlType='submit' className="button_excel">
              <FileExcelFilled />
              <div className="font-medium text-md text-[#5B69E6]">Nhập Excel</div>
            </Button>
          </Form.Item>
        </div>
        <div>
          <div className='mb-6 text-center text-lg font-semibold'>Thông số chung</div>
          <div>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item label='Khoa Phòng' name="department" className='mb-5'>
                <Select
                  showSearch
                  placeholder="Chọn Khoa - Phòng"
                  optionFilterProp="children"
                  allowClear
                  virtual
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                  }
                  options={options(departments)}
                  onChange={(value: any) => onChange('department', value)}
                />
              </Form.Item>
              <Form.Item label='Trạng thái thiết bị' name="status" className='mb-5'>
                <Select
                  showSearch
                  placeholder="Chọn Trạng thái"
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                  }
                  className="select-custom"
                  options={options(statuses)}
                  onChange={(value: any) => onChange('status', value)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>

    </div>
  )
}

export default ImportEquipmentByExcel