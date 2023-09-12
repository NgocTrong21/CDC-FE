import { useContext, useState } from 'react';
import { FileExcelFilled } from '@ant-design/icons';
import { Button, Divider, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userApi from 'api/user.api';
import * as xlsx from 'xlsx';
import { FilterContext } from 'contexts/filter.context';

const ImportEquipmentTypeByExcel = () => {
  const navigate = useNavigate();
  // const [group, setGroup] = useState<number>();
  // const { groups } = useContext(FilterContext);
  // const options = (array: any) => {
  //   return array.map((item: any) => {
  //     let o: any = {};
  //     o.value = item.id;
  //     o.label = item.name;
  //     return o;
  //   })
  // }
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);

  // const onChange = (value: any) => {
  //   setGroup(value);
  // }

  const onFinish = () => {
    userApi
      .uploadExcel(data)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Nhập danh sách loại thiết bị thành công!');
          form.resetFields();
        } else {
          toast.error(message);
        }
      })
      .catch();
  };

  const readUploadFile = (e: any) => {
    let newWorkSheet: any = [];
    e.preventDefault();
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
          const alias = workSheet[`B${i}`]?.v;
          const group_id = workSheet[`C${i}`]?.v;
          newWorkSheet.push({ name, alias, group_id });
        }
        setData(newWorkSheet);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP DANH SÁCH LOẠI THIẾT BỊ TỪ EXCEL</div>
        <div className="flex flex-row gap-6">
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => navigate('/category/group/create')}
          >
            <FileExcelFilled />
            <div className="font-medium text-md text-[#5B69E6]">Mẫu Excel</div>
          </Button>
        </div>
      </div>
      <Divider />
      <Form
        className="flex justify-between"
        onFinish={onFinish}
        form={form}
        layout="vertical"
      >
        <div>
          <Form.Item className="fileUploadInput" name="excel">
            <Input
              type="file"
              placeholder="Chọn file excel"
              onChange={(e: any) => readUploadFile(e)}
            />
            <button>+</button>
          </Form.Item>
          <Form.Item className="mt-6">
            <Button
              htmlType="submit"
              className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            >
              <FileExcelFilled />
              <div className="font-medium text-md text-[#5B69E6]">
                Nhập Excel
              </div>
            </Button>
          </Form.Item>
        </div>
        {/* <div>
          <div className='mb-6 text-center text-lg font-semibold'>Thông số chung</div>
          <Form.Item
            label='Nhóm thiết bị'
            name="department"
            required
            rules={[{ required: true, message: 'Hãy chọn Nhóm thiết bị!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder="Chọn nhóm thiết bị"
              optionFilterProp="children"
              allowClear
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              options={options(groups)}
              onChange={onChange}
            />
          </Form.Item>
        </div> */}
      </Form>
    </div>
  );
};

export default ImportEquipmentTypeByExcel;
