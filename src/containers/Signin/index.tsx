import React, { useEffect } from 'react';
import bg from 'assets/bg.jpg';
import { PoweroffOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { Link, useNavigate } from 'react-router-dom';
import {
  authActions,
  LoginPayLoad,
  selectIsLoading,
  selectMessageLogin,
} from 'store/slices/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Input, Form } from 'antd';
import ReactGA from 'react-ga';
import { ACCESS_TOKEN } from 'constants/auth.constant';

const Signin: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const messageLogin = useSelector(selectMessageLogin);
  const navigate = useNavigate();
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    const isLoggin: boolean = Boolean(localStorage.getItem(ACCESS_TOKEN));
    if (isLoggin) {
      navigate('/equipment/list_eq');
    }
  }, []);

  const handleLogin = (values: LoginPayLoad) => {
    ReactGA.event({
      category: 'auth',
      action: 'login',
      label: values.email,
      value: 1,
    });
    dispatch(authActions.login(values));
  };

  return (
    <>
      <div
        className="flex w-screen h-screen justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="flex justify-center items-center flex-col">
          <div className="bg-white p-10 rounded-3xl w-[450px] shadow-2xl">
            <div className="text-center font-medium text-2xl mb-10 leading-10">
              HỆ THỐNG QUẢN LÝ THIẾT BỊ VÀ VẬT TƯ Y TẾ CDC HẢI PHÒNG
            </div>
            <Form
              name="signin-form"
              className="signin-form"
              form={form}
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <h1 className="font-bold text-lg">Đăng nhập</h1>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[
                  { required: true, message: 'Hãy nhập email của bạn!' },
                  { type: 'email', message: 'Định dạng Email không đúng!' },
                ]}
              >
                <Input className="rounded-lg h-9 border-[#A3ABEB] border-2" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                required
                rules={[
                  { required: true, message: 'Hãy nhập mật khẩu của bạn!' },
                ]}
              >
                <Input.Password className="rounded-lg h-9 border-[#A3ABEB] border-2" />
              </Form.Item>
              {messageLogin && <Alert message={messageLogin} type="error" />}
              {/* <Form.Item> */}
              <Text className="flex justify-end">
                <Link to="/reset_password">Quên mật khẩu</Link>
              </Text>
              {/* </Form.Item> */}
              <Form.Item className="mt-5">
                <Button
                  type="primary"
                  icon={<PoweroffOutlined />}
                  loading={isLoading}
                  htmlType="submit"
                  className="rounded-lg h-10 flex items-center justify-center w-[-webkit-fill-available]"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
              <Text className="flex justify-center gap-2">
                <Link to="/signup">Đăng ký</Link> nếu bạn chưa có tài khoản{' '}
              </Text>
            </Form>
          </div>
        </div>
        {/* <div className="mb-4 ml-4">© 2022 All rights reserved.</div> */}
        {/* <div
          className="p-12 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        ></div> */}
      </div>
    </>
  );
};

export default Signin;
