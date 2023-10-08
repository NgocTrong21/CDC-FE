import { Button, Divider, Form, Input, Select } from 'antd';
import userApi from 'api/user.api';
import { FilterContext } from 'contexts/filter.context';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { convertBase64, options } from 'utils/globalFunc.util';
import ava from 'assets/image.png';
import { CURRENT_USER } from 'constants/auth.constant';
import Loading from 'components/Loading';

const Profile = () => {
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const { id } = user;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { roles, departments } = useContext(FilterContext);
  const [error, setError] = useState<any>();

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const getDetail = () => {
    setLoading(true);
    userApi
      .getProfile(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let user = data?.user;
        console.log(res.data.success);
        if (success) {
          form.setFieldsValue({
            id: user?.id,
            name: user?.name,
            phone: user?.phone,
            email: user?.email,
            address: user?.address,
            role_id: user?.role_id,
            department_id: user?.department_id,
            image: user?.image,
          });
          setError('');
          // setUser('');
          setImage(user.image);
        } else {
          toast.error('Bạn không có quyền truy cập tài khoản này!');
          setError('Bạn không có quyền truy cập tài khoản này!');
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  const onFinish = (values: any) => {
    const data = { ...values, image };
    setLoadingUpdate(true);
    userApi
      .updateProfile(data)
      .then((res) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật thông tin thành công!');
        } else {
          toast.error('Cập nhật thông tin thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  useEffect(() => {
    getDetail();
  }, [id]);

  console.log(error);

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">Thông tin tài khoản</div>
      </div>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex-between mt-10">
          <Form
            form={form}
            className="basis-3/4"
            layout="vertical"
            size="large"
            onFinish={onFinish}
          >
            <Form.Item name="id" required style={{ display: 'none' }}>
              <Input style={{ display: 'none' }} />
            </Form.Item>
            <div className="grid grid-cols-2 gap-5">
              <Form.Item
                label="Tên người dùng"
                name="name"
                required
                rules={[
                  { required: true, message: 'Hãy nhập tên người dùng!' },
                ]}
                className="mb-5"
              >
                <Input
                  placeholder="Nhập tên người dùng"
                  allowClear
                  className="rounded-lg h-9 border-[#A3ABEB] border-2"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                className="mb-5"
                required
                rules={[
                  { required: true, message: 'Hãy nhập email!' },
                  { type: 'email', message: 'Nhập đúng định dạng email' },
                ]}
              >
                <Input
                  placeholder="Nhập email"
                  allowClear
                  className="rounded-lg h-9 border-[#A3ABEB] border-2"
                  disabled
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Form.Item
                label="Khoa Phòng"
                name="department_id"
                // required
                // rules={[{ required: true, message: 'Hãy chọn Khoa phòng!' }]}
                className="mb-5"
              >
                <Select
                  placeholder="Chọn Khoa Phòng"
                  options={options(departments)}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Chức vụ"
                name="role_id"
                required
                rules={[{ required: true, message: 'Hãy chọn Chức vụ!' }]}
                className="mb-5"
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Hãy chọn Chức vụ"
                  options={options(roles)}
                  disabled
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Form.Item label="Số điện thoại" name="phone" className="mb-5">
                <Input
                  placeholder="Nhập số điện thoại"
                  allowClear
                  className="rounded-lg h-9 border-[#A3ABEB] border-2"
                />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address" className="mb-5">
                <Input
                  placeholder="Nhập địa chỉ"
                  allowClear
                  className="rounded-lg h-9 border-[#A3ABEB] border-2"
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                htmlType="submit"
                loading={loadingUpdate}
                className="button-primary"
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
          <div className="flex flex-col gap-4 items-center basis-1/4 ">
            <div className="text-center leading-9 ">Hình ảnh người dùng</div>

            {selectedImage === '' ? (
              <img
                src={image !== null ? image : ava}
                alt="Hình ảnh người dùng"
                className="w-52 h-52  rounded-full bg-center bg-no-repeat bg-cover"
              />
            ) : (
              <div
                className="w-52 h-52 rounded-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${selectedImage})` }}
              ></div>
            )}
            {/* </label> */}
            <div className="mt-6">Thay đổi hình ảnh người dùng</div>
            <input
              type="file"
              className="block file:bg-violet-100 file:text-violet-700 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-200"
              id="inputImage"
              onChange={(e: any) => handleChangeImg(e)}
            />
          </div>
        </div>
      )}
    </div>
    // ) : (
    //   <div className="flex-between-center">
    //     <div className="title">{error}</div>
    //   </div>
  );
};

export default Profile;
