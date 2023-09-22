import { Button, Divider, Form, Input, Select } from 'antd';
import { useEffect, useState, useContext } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import { FilterContext } from 'contexts/filter.context';

const { TextArea } = Input;

const SupplyUpdate = () => {
  const { units, providers } = useContext(FilterContext);
  const [image, setImage] = useState<any>('');
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [form] = Form.useForm();

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };
  const onFinish = () => {};
  useEffect(() => {}, []);
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬT VẬT TƯ</div>
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
              label="Tên vật tư"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên vật tư!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập tên vật tư"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Mã vật tư"
              name="code"
              required
              rules={[{ required: true, message: 'Hãy nhập mã vật tư!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập mã vật tư"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5"></div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              label="Đơn vị tính"
              name="unit_id"
              required
              rules={[{ required: true, message: 'Hãy chọn đơn vị tính!' }]}
              className="mb-5"
            >
              <Select
                showSearch
                placeholder="Chọn đơn vị tính"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={options(units)}
              />
            </Form.Item>
            <Form.Item label="Giá nhập" name="import_price" className="mb-5">
              <Input
                placeholder="Nhập giá vật tư"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Xuất sứ"
              name="manufacturing_country"
              required
              rules={[{ required: true, message: 'Hãy nhập xuất sứ!' }]}
              className="mb-5"
            >
              <Input placeholder="Nhập xuất sứ" allowClear className="input" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item label="Nhà cung cấp" name="provider_id" className="mb-5">
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={options(providers)}
              />
            </Form.Item>
            <Form.Item
              label="Hãng sản xuất"
              name="manufacturer"
              required
              rules={[{ required: true, message: 'Hãy nhập hãng sản xuất!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập hãng sản xuất"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Ghi chú" name="note" className="mb-5">
              <TextArea placeholder="Ghi chứ" rows={4} className="textarea" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button className="button-primary" htmlType="submit">
              Hoàn thành
            </Button>
          </Form.Item>
        </Form>
        <div className="basis-1/3 mt-4 flex flex-col items-center">
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
        </div>
      </div>
    </div>
  );
};

export default SupplyUpdate;
