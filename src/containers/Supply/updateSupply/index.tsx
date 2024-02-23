import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd';
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
  const { units } = useContext(FilterContext);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const [image, setImage] = useState<any>('');
  const [status, setStatus] = useState<boolean>(false);
  const [active, setActive] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [form] = Form.useForm();
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
      name: values.name.trim() || '',
      code: values.code.trim() || '',
      lot_number: values.lot_number.trim() || '',
      expiration_date: moment(new Date(values?.expiration_date)).toISOString(),
      image,
      status: status ? 1 : 2,
    };
    supplyApi
      .update(data)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Cập nhật vật tư thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
          navigate(`/supplies/list_sp`);
        } else {
          toast.error(message || 'Cập nhật vật tư thất bại!');
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  const getDetailEquipment = (id: any) => {
    supplyApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          const {
            id,
            name,
            code,
            expiration_date,
            lot_number,
            manufacturing_country,
            provider,
            unit,
            unit_price,
            note,
            image,
          } = data.supply;
          setStatus(data.supply.status === 1);
          setActive(data.supply.active);
          form.setFieldsValue({
            id,
            name,
            code,
            lot_number,
            manufacturing_country,
            provider,
            unit: +unit,
            unit_price,
            expiration_date: moment(expiration_date),
            note,
          });
          setImage(image);
        }
      })
      .catch();
  };

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
              required
              rules={[{ required: true, message: 'Hãy nhập mã vật tư!' }]}
            >
              <Input
                placeholder="Nhập mã vật tư"
                allowClear
                className="input"
                disabled={active === 2}
              />
            </Form.Item>
            <Form.Item
              label="Số lô"
              name="lot_number"
              className="mb-5"
              required
              rules={[{ required: true, message: 'Hãy nhập số lô!' }]}
            >
              <Input
                placeholder="Nhập số lô"
                allowClear
                className="input"
                disabled={active === 2}
              />
            </Form.Item>
            <Form.Item
              label="Hạn sử dụng"
              name="expiration_date"
              required
              rules={[{ required: true, message: 'Hãy nhập hạn sử dụng!' }]}
            >
              <DatePicker className="date" disabled={active === 2} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              label="Đơn vị tính"
              name="unit"
              required
              rules={[{ required: true, message: 'Hãy nhập đơn vị tính!' }]}
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
                disabled={active === 2}
              />
            </Form.Item>
            <Form.Item
              label="Đơn giá"
              name="unit_price"
              className="mb-5"
              rules={[{ required: true, message: 'Hãy nhập đơn giá!' }]}
            >
              <InputNumber
                min={0}
                placeholder="Nhập đơn giá vật tư"
                className="input w-full flex items-center"
                formatter={(value) => {
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }}
                precision={0}
                disabled={active === 2}
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
            <Button
              className="button-primary"
              htmlType="submit"
              loading={loading}
            >
              Hoàn thành
            </Button>
          </Form.Item>
        </Form>
        <div className="flex flex-col gap-4 items-center basis-1/4 ">
          <Form.Item label="Trạng thái" name="status" className="mb-5">
            <Switch
              style={{ backgroundColor: status ? 'blue' : 'gray' }}
              checked={status}
              onChange={(e) => {
                setStatus(e);
              }}
              checkedChildren="Sử dụng tốt"
              unCheckedChildren="Hết hạn dùng"
            />
          </Form.Item>
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

export default SupplyUpdate;
