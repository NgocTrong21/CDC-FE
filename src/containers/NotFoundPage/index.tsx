import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getCurrentUser } from 'utils/globalFunc.util';

const NotFoundPage = () => {
  const currentUser = getCurrentUser();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn đang vào không tồn tại hoặc bạn không có quyền truy cập."
      extra={
        <Button type="default">
          {currentUser?.role_id !== 6 ? (
            <Link to="/equipment/list_eq">Quay lại Trang chủ</Link>
          ) : (
            <Link to="/supplies/list_sp">Quay lại Trang chủ</Link>
          )}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
