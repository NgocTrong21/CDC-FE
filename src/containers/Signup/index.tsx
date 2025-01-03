import React, { useState } from 'react';
import bg from 'assets/bg.jpg';
import { PoweroffOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { Link } from 'react-router-dom';
import {
  authActions,
  selectIsLoading,
  selectMessageRegister,
  RegisterPayLoad,
} from 'store/slices/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Input, Form } from 'antd';

const Signup: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const messageRegister = useSelector(selectMessageRegister);

  const handleRegister = (values: RegisterPayLoad) => {
    dispatch(authActions.registerRequest(values));
  };

  return (
    <>
      <div
        className="w-screen h-screen flex justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div>
          <div className="flex justify-center items-center flex-col pt-24">
            <div className="bg-white p-10 rounded-3xl w-[450px] shadow-2xl">
              <div className="text-center font-medium text-2xl mb-10 leading-10">
                HỆ THỐNG QUẢN LÝ THIẾT BỊ VÀ VẬT TƯ Y TẾ CDC HẢI PHÒNG
              </div>
              <Form
                name="signin-form"
                className="signin-form"
                form={form}
                initialValues={{ remember: true }}
                onFinish={handleRegister}
                autoComplete="off"
                layout="vertical"
                size="large"
              >
                <h1 className="font-bold text-lg">Đăng ký</h1>
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

                <Form.Item
                  label="Xác nhận Mật khẩu"
                  tooltip="Xác nhận Mật khẩu bằng cách nhập lại mật khẩu."
                  name="password_confirmation"
                  rules={[
                    {
                      required: true,
                      message: 'Hãy nhập lại mật khẩu của bạn!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Xác nhận Mật khẩu của bạn chưa đúng!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password className="rounded-lg h-9 border-[#A3ABEB] border-2" />
                </Form.Item>

                {messageRegister && (
                  <Alert message={messageRegister} type="error" />
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    icon={<PoweroffOutlined />}
                    loading={isLoading}
                    htmlType="submit"
                    className="flex items-center justify-center rounded-lg h-10 w-[-webkit-fill-available] mt-4"
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
                <Text className="flex justify-center gap-2">
                  <Link to="/">Đăng nhập</Link> nếu bạn đã có tài khoản{' '}
                </Text>
              </Form>
            </div>
          </div>
          {/* <div className="mb-4 ml-4">© 2022 All rights reserved.</div> */}
        </div>
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

export default Signup;
