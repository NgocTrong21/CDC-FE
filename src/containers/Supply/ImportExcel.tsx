import { useState } from 'react';
import { FileExcelFilled } from '@ant-design/icons';
import { Button, Divider, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import * as xlsx from 'xlsx';
import SupplyImportFileExcel from 'components/SupplyImportFileExcel';
import supplyApi from 'api/suplly.api';

const ImportSupplyByExcel = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);

  const onFinish = () => {
    supplyApi
      .uploadExcel(data)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Nhập danh sách vật tư thành công!');
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
          const code = workSheet[`B${i}`]?.v;
          const model = workSheet[`C${i}`]?.v;
          const serial = workSheet[`D${i}`]?.v;
          const manufacturer = workSheet[`E${i}`]?.v;
          const manufacturing_country = workSheet[`F${i}`]?.v;
          const year_of_manufacture = workSheet[`G${i}`]?.v;
          const year_in_use = workSheet[`H${i}`]?.v;
          const warehouse_import_date = new Date(
            (workSheet[`I${i}`]?.v - (25567 + 2)) * 86400000
          ).valueOf();
          const project_id = workSheet[`J${i}`]?.v;
          const note = workSheet[`K${i}`]?.v;
          const technical_parameter = workSheet[`L${i}`]?.v;
          const configuration = workSheet[`M${i}`]?.v;
          const import_price = workSheet[`N${i}`]?.v;
          const risk_level = workSheet[`O${i}`]?.v;
          const usage_procedure = workSheet[`P${i}`]?.v;
          const unit_id = workSheet[`Q${i}`]?.v;
          const type_id = workSheet[`R${i}`]?.v;
          newWorkSheet.push({
            name,
            code,
            model,
            serial,
            manufacturer,
            manufacturing_country,
            year_in_use,
            year_of_manufacture,
            warehouse_import_date,
            project_id,
            note,
            technical_parameter,
            configuration,
            import_price,
            risk_level,
            usage_procedure,
            unit_id,
            type_id,
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
        <div className="title">NHẬP VẬT TƯ TỪ EXCEL</div>
        <div className="flex flex-row gap-6">
          <SupplyImportFileExcel />
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
            <div className="flex flex-row gap-6">
              <Button htmlType="submit" className="button_excel">
                <FileExcelFilled />
                <div className="font-medium text-md text-[#5B69E6]">
                  Nhập Excel
                </div>
              </Button>
              <Button className="button_excel">
                <FileExcelFilled />
                <div className="font-medium text-md text-[#5B69E6]">
                  Xoá file
                </div>
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ImportSupplyByExcel;
