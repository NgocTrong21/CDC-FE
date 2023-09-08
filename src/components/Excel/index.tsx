import { Button } from 'antd';
import { FileExcelFilled } from '@ant-design/icons';

const ExportToExcel = (props: any) => {
  const { callback, loading } = props;

  return (
    <Button
      className="button_excel"
      onClick={() => callback()}
      loading={loading}
    >
      <FileExcelFilled />
      <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
    </Button>
  );
};

export default ExportToExcel;
