import * as fs from 'file-saver';
import { Button } from 'antd';
import { FileExcelFilled } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { addRow, mergeCells } from 'utils/globalFunc.util';

const ExportToExcel = (props: any) => {
  const { getData } = props;

  const exportToExcel = () => {
    const {data, fileName, sheetName, headerName} = getData();
    if (!data || data.length === 0) {
      return;
    }
    const myHeader = data[0].map((item: any) => item.title);
    const widths = data[0].map((item: any) => ({ width: item.width }));
    let newData: any = data.slice(1, data?.length);
    exportToExcelPro(
      newData,
      fileName,
      sheetName,
      headerName,
      myHeader,
      widths
    );
  };

  const exportToExcelPro = async (
    myData: any,
    fileName: any,
    sheetName: any,
    report: any,
    myHeader: any,
    widths: any
  ) => {
    if (!myData || myData.length === 0) {
      console.error('Chưa có data');
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);
    const columns = myHeader?.length;

    const title = {
      border: true,
      height: 40,
      font: { size: 20, bold: false, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid', //darkVertical
        fgColor: {
          argb: '0000FF',
        },
      },
    };
    const header = {
      border: true,
      height: 0,
      font: { size: 12, bold: true, color: { argb: '000000' } },
      alignment: null,
      fill: null,
    };
    const data = {
      border: true,
      height: 0,
      font: { size: 12, bold: false, color: { argb: '000000' } },
      alignment: null,
      fill: null,
    };

    if (widths && widths.length > 0) {
      ws.columns = widths;
    }

    let row = addRow(ws, [report], title);
    mergeCells(ws, row, 1, columns);

    addRow(ws, myHeader, header);

    myData.forEach((row: any) => {
      addRow(ws, Object.values(row), data);
    });
    
    const buf = await wb.xlsx.writeBuffer();
    fs.saveAs(new Blob([buf]), `${fileName}.xlsx`);
  }

  return (
    <Button
      className="button_excel"
      onClick={() => exportToExcel()}
    >
      <FileExcelFilled />
      <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
    </Button>
  );
}

export default ExportToExcel;