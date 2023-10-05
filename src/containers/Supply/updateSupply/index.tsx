import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import { useEffect, useState, useContext } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import { FilterContext } from 'contexts/filter.context';
import supplyApi from 'api/suplly.api';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const SupplyUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
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
  const onFinish = (values: any) => {
    let data = { ...values, expiration_date: moment(new Date(values?.expiration_date)).toISOString(), image };
    supplyApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật vật tư thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
          navigate(`/supplies/list_sp`);
        } else {
          toast.error('Cập nhật vật tư thất bại!');
        }
      })
      .catch();
  };
  const getDetailEquipment = (id: any) => {
    supplyApi.detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          console.log(data.supply);
          const { id, name, code, expiration_date, lot_number, manufacturing_country, provider, unit, unit_price, note } = data.supply
          form.setFieldsValue({
            id, name, code, lot_number, manufacturing_country, provider, unit, unit_price, expiration_date: moment(expiration_date), note
          })
        }
      })
      .catch()
  }

  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);
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
            <Form.Item name="id" className="mb-5 hidden ">
              <Input className="input" />
            </Form.Item>
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
            >
              <Input
                placeholder="Nhập số lô"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item label="Hạn sử dụng" name="expiration_date">
              <DatePicker className="date" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              label="Đơn vị tính"
              name="unit"
              className="mb-5"
            >
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
              required
              rules={[{ required: true, message: 'Hãy nhập xuất sứ!' }]}
              className="mb-5"
            >
              <Input placeholder="Nhập xuất sứ" allowClear className="input" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item label="Nhà cung cấp" name="provider" className="mb-5">
              <Input placeholder="Nhập nhà cung cấp" allowClear className="input" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Ghi chú" name="note" className="mb-5">
              <TextArea placeholder="Ghi chú" rows={4} className="textarea" />
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
