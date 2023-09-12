import { Button, Form, Input, Modal } from 'antd'
import authApi from 'api/auth.api';
import { CURRENT_USER } from 'constants/auth.constant';
import { useState} from 'react'
import { toast } from 'react-toastify';

const ModalChangePassword = (props: any) => {

  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const {
    showChangePasswordModal,
    setShowChangePasswordModal,
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    const data = { ...values, id: user.id };
    try {
      const response = await authApi.changePassword(data);
      const { success } = response.data;
      if(success) {
        toast.success('Đổi mật khẩu thành công!');
        form.resetFields();
        setShowChangePasswordModal();
      } else {
        toast.error('Đổi mật khẩu thất bại!');
      }
    } catch(error) {
      console.log('error', error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Thay đổi mật khẩu"
      open={showChangePasswordModal}
      onCancel={setShowChangePasswordModal}
      footer={null}
    >
      <Form form={form}  layout="vertical" size="large" onFinish={handleChangePassword}>
        <Form.Item 
          label="Nhập mật khẩu cũ" 
          name="password" 
          required
          rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
        >
          <Input.Password className='input' />
        </Form.Item>
        <Form.Item 
          label="Nhập mật khẩu mới" 
          name="new_password"
          required
          rules={[{ required: true, message: 'Hãy nhập mật khẩu mới!' }]}
        >
          <Input.Password className='input' />
        </Form.Item>
        <Form.Item 
          label="Xác nhận mật khẩu mới" 
          name="new_password_confirm"
          required
          rules={[{ required: true, message: 'Hãy nhập lại mật khẩu mới!' }]}
        >
          <Input.Password className='input' />
        </Form.Item>
        
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button htmlType="submit" className='button-primary' loading={loading}>Xác nhận</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={setShowChangePasswordModal} className='button-primary'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalChangePassword