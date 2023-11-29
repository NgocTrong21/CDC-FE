import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';

const { TextArea } = Input;

const ImportOne = () => {
  const {
    departments,
    statuses,
  } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataChange, setDataChange] = useState<any>({});

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const onchange = async (e: any) => {
    const newDataChange = { ...dataChange, [e.target.id]: e.target.value };
    setDataChange(newDataChange);
  };

  const onFinish = (values: any) => {
    let data = {
      ...values,
      handover_date: moment(
        new Date(values.handover_date)
      ).toISOString(),
      image, department_id: 1, status_id: 3
    };
    setLoading(true);
    equipmentApi
      .create(data)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Thêm mới thiết bị thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
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
        <div className="title">NHẬP THIẾT BỊ</div>
      </div>
      <Divider />
      <div className="flex flex-row gap-6 my-8">
        <Form
          form={form}
          className="basis-3/4"
          layout="vertical"
          size="large"
          onFinish={onFinish}
          onChange={onchange}
        >
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              label="Tên thiết bị"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên thiết bị!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập tên thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Khoa - Phòng"
              className="mb-5"
              required
              rules={[
                {
                  required: true,
                  message: 'Hãy chọn khoa phòng!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn khoa phòng"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={options(departments)}
              />
            </Form.Item>
            <Form.Item label="Trạng thái thiết bị" className="mb-5">
              <Input
                className="input"
                defaultValue={
                  options(statuses).find((item: any) => item.value === 3).label
                }
                disabled
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-4 gap-5">
            <Form.Item
              label="Số hiệu TSCĐ"
              name="fixed_asset_number"
              rules={[
                {
                  required: false,
                  message: 'Hãy nhập Số hiệu TSCĐ thiết bị!',
                },
              ]}
              className="mb-5"
            >
              <Input placeholder="Nhập mã TSCĐ" allowClear className="input" />
            </Form.Item>
            <Form.Item
              label="Model"
              name="model"
              className="mb-5"
            >
              <Input
                placeholder="Nhập model của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Serial"
              name="serial"
              className="mb-5"
            >
              <Input
                placeholder="Nhập serial của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Đơn vị tính"
              name="unit"
              rules={[{ required: false, message: 'Hãy nhập đơn vị tính!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập đơn vị tính"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-4 gap-5">
            <Form.Item label="Năm sử dụng" name="year_in_use" className="mb-5">
              <Input
                placeholder="Nhập năm sử dụng của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Nước sản xuất"
              name="manufacturing_country_id"
              className="mb-5"
            >
              <Input
                placeholder="Nhập xuất sứ của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item label="Thành tiền" name="initial_value" className="mb-5">
              <Input
                placeholder="Nhập thành tiền thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Khấu hao hàng năm (%)"
              name="annual_depreciation"
              className="mb-5"
            >
              <Input
                placeholder="Nhập Khấu hao hàng năm"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-4 gap-5">
            <Form.Item
              label="Giá trị còn lại"
              name="residual_value"
              className="mb-5"
            >
              <Input
                placeholder="Nhập giá trị còn lại"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Năm sản xuất"
              name="year_of_manufacture"
              rules={[
                {
                  required: false,
                  message: 'Hãy nhập năm sản xuất của thiết bị!',
                },
              ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập năm sản xuất của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Ngày bàn giao"
              name="handover_date"
              className="mb-5"
            >
              <DatePicker className="textarea" placeholder="Chọn ngày" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-5">
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
              Thêm
            </Button>
          </Form.Item>
        </Form>
        <div className="flex flex-col gap-4 items-center basis-1/4 ">
          <div className="text-center leading-9 ">Hình ảnh thiết bị</div>
          {selectedImage === '' ? (
            <img
              src={ava}
              alt="Hình ảnh thiết bị"
              className="w-52 h-52  rounded-lg"
            />
          ) : (
            <div
              className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>
          )}
          <div className="mt-6">Chọn hình ảnh thiết bị</div>
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

export default ImportOne;
