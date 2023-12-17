import { Button, Divider, Form, Input, Select } from 'antd';
import { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import userApi from 'api/user.api';

const CreateUser = () => {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { roles, departments } = useContext(FilterContext);

  const options = (array: any) => {
    return array.map((item: any) => {
      let o: any = {};
      o.value = item.id;
      o.label = item.name;
      return o;
    });
  };

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    userApi
      .create({
        ...values,
        image,
      })
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          form.resetFields();
          toast.success('Thêm mới thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">THÊM MỚI NGƯỜI DÙNG</div>
      </div>
      <Divider />
      <div className="flex-between mt-10">
        <Form
          form={form}
          className="basis-2/3"
          layout="vertical"
          size="large"
          onFinish={onFinish}
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Tên người dùng"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên người dùng!' }]}
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
              required
              rules={[
                { required: true, message: 'Hãy nhập email!' },
                { type: 'email', message: 'Nhập đúng định dạng email' },
              ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập email"
                allowClear
                className="rounded-lg h-9 border-[#A3ABEB] border-2"
              />
            </Form.Item>
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
              />
            </Form.Item>
            <Form.Item
              label="Chức vụ"
              name="role_id"
              required
              rules={[{ required: true, message: 'Hãy chọn Chức vụ!' }]}
              className="mb-5"
            >
              <Select placeholder="Chọn Chức vụ" options={options(roles)} />
            </Form.Item>
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
              loading={loading}
              className="button-primary"
            >
              Thêm
            </Button>
          </Form.Item>
        </Form>
        <div className="flex flex-col gap-4 items-center basis-1/4 ">
          <div className="text-center leading-9 ">Ảnh đại diện</div>
          {selectedImage === '' ? (
            <img
              src={image ? image : ava}
              alt="Ảnh đại diện"
              className="w-52 h-52 rounded-lg object-contain"
            />
          ) : (
            <div
              className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>
          )}
          <div className="mt-6">Thay đổi ảnh đại diện</div>
          <input
            type="file"
            className="block file:bg-violet-100 file:text-violet-700 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-200"
            id="inputImage"
            onChange={(e: any) => handleChangeImg(e)}
          />
        </div>
        {/* <div className="basis-1/3 mt-4 flex flex-col items-center">
          <div className="text-center mb-4">Ảnh đại diện</div>
          <div className="preview-content">
            <input
              type="file"
              hidden
              className="form-control"
              id="inputImage"
              onChange={(e: any) => handleChangeImg(e)}
            />
            <label className="text-center" htmlFor="inputImage">
              {image === '' ? (
                <img src={ava} alt="ava" className="w-52 h-52" />
              ) : (
                <div
                  className="w-52 h-52 bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url(${selectedImage})` }}
                ></div>
              )}
            </label>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CreateUser;
