import * as fs from 'file-saver';
import { Button } from 'antd';
import { FileExcelFilled } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { addRow } from 'utils/globalFunc.util';

const EquipmentImportFileExcel = () => {
  const exportToExcel = () => {
    const myHeader = [
      'Tên thiết bị', 'Code', 'Model', 'Serial',
      'Hãng sản xuất', 'Xuất xứ', 'Năm sản xuất', 'Năm sử dụng',
      'Ngày nhập kho', 'Dự án', 'Ghi chú', 'Giá trị ban đầu', 'Khấu hao hằng năm',
      'Thông số kỹ thuật', 'Cấu hình kỹ thuật', 'Giá nhập', 'Mức độ rủi ro',
      'Quy trình sử dụng', 'Đơn vị tính'
    ]
    const widths = myHeader.map((item: any) => ({ width: 25 }));
    exportToExcelPro('File excel mẫu nhập thiết bị', 'Sheet A', myHeader, widths);
  };

  const exportToExcelPro = async (
    fileName: any,
    sheetName: any,
    myHeader: any,
    widths: any
  ) => {

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);

    const header = {
      border: true,
      height: 0,
      font: { size: 12, bold: true, color: { argb: '000000' } },
      alignment: null,
      fill: null,
    };
    if (widths && widths.length > 0) {
      ws.columns = widths;
    }
    addRow(ws, myHeader, header);
    const buf = await wb.xlsx.writeBuffer();
    fs.saveAs(new Blob([buf]), `${fileName}.xlsx`);
  }


  return (
    <Button className="button_excel" onClick={() => exportToExcel()}>
      <FileExcelFilled />
      <div className="font-medium text-md text-[#5B69E6]">EXCEL mẫu</div>
    </Button>
  );
};




export default EquipmentImportFileExcel;