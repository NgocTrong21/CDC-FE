import { Button, Divider, Form, Input, Select } from 'antd';
import { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import providerApi from 'api/provider.api';
import TextArea from 'antd/lib/input/TextArea';
import warehouseApi from 'api/warehouse.api';

const ImportWarehouse = () => {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);

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
    warehouseApi
      .create({ data: values })
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Thêm mới kho thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
        } else {
          toast.error(message || 'Thêm mới kho thất bại!');
        }
      })
      .catch();
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">THÊM MỚI KHO</div>
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
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Tên kho"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên nhà kho!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập tên kho"
                allowClear
                className="rounded-lg h-9 border-[#A3ABEB] border-2"
              />
            </Form.Item>
            <Form.Item
              label="Mã kho"
              name="code"
              className="mb-5"
              required
              rules={[{ required: true, message: 'Hãy nhập mã kho!' }]}
            >
              <Input
                placeholder="Nhập mã kho"
                allowClear
                className="rounded-lg h-9 border-[#A3ABEB] border-2"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5"></div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Thủ kho" name="storekeeper" className="mb-5">
              <Input
                placeholder="Nhập tên"
                allowClear
                className="rounded-lg h-9 border-[#A3ABEB] border-2"
              />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note" className="mb-5">
              <TextArea placeholder="Ghi chú" rows={5} className="textarea" />
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

export default ImportWarehouse;
