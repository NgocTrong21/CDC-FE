import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, InputNumber, Select } from 'antd';
import { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supplyApi from 'api/suplly.api';
import moment from 'moment';
import { FilterContext } from 'contexts/filter.context';

const { TextArea } = Input;

const SupplyCreate = () => {
  const {
    units
  } = useContext(FilterContext);
  const navigate = useNavigate();
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
    setLoading(true);
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
      .catch()
      .finally(() => setLoading(false));
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
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item
              label="Tên vật tư"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên vật tư!' }]}
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
            <Form.Item
              label="Đơn vị tính"
              name="unit"
              required
              rules={[{ required: false, message: 'Hãy nhập đơn vị tính!' }]}
              className="mb-5"
            >
              <Select
                showSearch
                placeholder="Chọn đơn vị"
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
            <Form.Item label="Đơn giá" name="unit_price" className="mb-5">
              <InputNumber
                min={0}
                placeholder="Nhập đơn giá vật tư"
                className='input w-full flex items-center'
                formatter={(value) => {
                  return `${value}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ','
                  );
                }}
                precision={0}
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
            <Button className="button-primary" htmlType="submit" loading={loading}>
              Thêm
            </Button>
          </Form.Item>
        </Form>
        <div className="flex flex-col gap-4 items-center basis-1/4 ">
          <div className="text-center leading-9 ">Hình ảnh thiết bị</div>
          {selectedImage === '' ? (
            <img
              src={image ? image : ava}
              alt="Hình ảnh thiết bị"
              className="w-52 h-52 rounded-lg object-contain"
            />
          ) : (
            <div
              className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>
          )}
          <div className="mt-6">Thay đổi hình ảnh thiết bị</div>
          <input
            type="file"
            className="block file:bg-violet-100 file:text-violet-700 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-200"
            id="inputImage"
            onChange={(e: any) => handleChangeImg(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplyCreate;
