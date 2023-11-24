import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input } from 'antd';
import { useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supplyApi from 'api/suplly.api';
import moment from 'moment';

const { TextArea } = Input;

const SupplyCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');

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
    let data = {
      ...values,
      expiration_date: moment(new Date(values?.expiration_date)).toISOString(),
      image,
    };
    supplyApi
      .create(data)
      .then((res: any) => {
        const { success, message } = res.data;
        console.log(res.data);

        if (success) {
          toast.success('Thêm mới vật tư thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
        } else {
          toast.error(message || 'Thêm mới vật tư thất bại!');
        }
      })
      .catch();
  };
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP VẬT TƯ</div>
        <Button className="button_excel">
          <ImportOutlined />
          <div
            className="font-medium text-md text-[#5B69E6]"
            onClick={() => navigate('/supplies/import_excel_sp')}
          >
            Nhập Excel
          </div>
        </Button>
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
              className="mb-5"
              required
              rules={[{ required: true, message: 'Hãy nhập mã vật tư!' }]}
            >
              <Input
                placeholder="Nhập mã vật tư"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Số lô"
              name="lot_number"
              className="mb-5"
              required
              rules={[{ required: true, message: 'Hãy nhập số lô!' }]}
            >
              <Input placeholder="Nhập số lô" allowClear className="input" />
            </Form.Item>
            <Form.Item label="Hạn sử dụng" name="expiration_date">
              <DatePicker className="date" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item label="Đơn vị tính" name="unit" className="mb-5">
              <Input
                placeholder="Nhập đơn vị tính"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item label="Đơn giá" name="unit_price" className="mb-5">
              <Input
                placeholder="Nhập đơn giá vật tư"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Xuất sứ"
              name="manufacturing_country"
              className="mb-5"
            >
              <Input placeholder="Nhập xuất sứ" allowClear className="input" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item label="Nhà cung cấp" name="provider" className="mb-5">
              <Input
                placeholder="Nhập nhà cung cấp"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Ghi chú" name="note" className="mb-5">
              <TextArea placeholder="Ghi chú" rows={4} className="textarea" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button className="button-primary" htmlType="submit">
              Thêm
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

export default SupplyCreate;
