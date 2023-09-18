import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import { useNavigate } from 'react-router-dom';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import categoryApi from 'api/category.api';

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';

const ImportOne = () => {
  const {
    departments,
    statuses,
    types,
    levels,
    units,
    groups,
    providers,
    projects,
  } = useContext(FilterContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [type, setType] = useState({});
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
    let data = { ...values, image, department_id: 1, status_id: 2 };
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

  const onChangeGroup = (value: any) => {
    categoryApi
      .listTypeBaseGroup(value)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setType(data?.types);
        }
      })
      .catch();
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP THIẾT BỊ</div>
        {/* <Button className="button_excel">
          <ImportOutlined />
          <div
            className="font-medium text-md text-[#5B69E6]"
            onClick={() => navigate('/equipment/import_excel_eq')}
          >
            Nhập Excel
          </div>
        </Button> */}
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
          {/* Hàng 1 ===========================================================*/}
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
            <Form.Item label="Khoa - Phòng" className="mb-5">
              <Input
                className="input"
                defaultValue={
                  options(departments).find((item: any) => item.value === 1)
                    .label
                }
                disabled
              />
            </Form.Item>
            <Form.Item label="Trạng thái thiết bị" className="mb-5">
              <Input
                className="input"
                defaultValue={
                  options(statuses).find((item: any) => item.value === 2).label
                }
                disabled
              />
            </Form.Item>
          </div>
          {/* Hết hàng 1 ===========================================================*/}
          {/* Hàng 4 ===========================================================*/}
          <div className="grid grid-cols-4 gap-5">
            <Form.Item
              label="Số hiệu TSCĐ"
              name="fixed_asset_number"
              required
              rules={[
                {
                  required: true,
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
              // required
              // rules={[
              //   { required: true, message: 'Hãy nhập model của thiết bị!' },
              // ]}
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
              // required
              // rules={[
              //   { required: true, message: 'Hãy nhập serial của thiết bị!' },
              // ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập serial của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Mã hóa thiết bị"
              name="hash_code"
              // required
              // rules={[{ required: true, message: 'Hãy nhập mã hóa thiết bị!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập mã hoá thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>
          {/* Hết hàng 4 ===========================================================*/}
          {/* Hàng 2 ===========================================================*/}
          <div className="grid grid-cols-4 gap-5">
            {/* <Form.Item
              label="Loại thiết bị"
              name="type_id"
              // required
              // rules={[{ required: true, message: 'Hãy chọn loại thiết bị!' }]}
              className="mb-5"
            >
              <Select
                showSearch
                placeholder="Chọn loại thiết bị"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={options(types)}
              />
            </Form.Item>
            {/* <Form.Item label="Đơn vị tính" name="unit_id" className="mb-5">
            </Form.Item> */}
            {/* <Form.Item label="Đơn vị tính" name="unit_id" className="mb-5">
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
            </Form.Item> */}
            <Form.Item
              label="Đơn vị tính"
              name="unit"
              required
              rules={[{ required: true, message: 'Hãy nhập đơn vị tính!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập đơn vị tính"
                allowClear
                className="input"
              />
            </Form.Item>

            {/* <Form.Item label="Mức độ rủi ro" name="risk_level" className="mb-5">
              <Select
                showSearch
                placeholder="Chọn mức độ rủi ro"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={options(levels)}
              />
            </Form.Item> */}
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
              // required
              // rules={[
              //   { required: true, message: 'Hãy nhập xuất sứ của thiết bị!' },
              // ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập xuất sứ của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>
          {/* Hết hàng 2 ===========================================================*/}

          {/* Hàng 3 ===========================================================*/}
          <div className="grid grid-cols-4 gap-5">
            {/* <Form.Item label="Số lượng" name="quantity" className="mb-5">
              <Input
                placeholder="Nhập số lượng thiết bị"
                allowClear
                className="input"
              />
            </Form.Item> */}
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
          </div>
          {/* Hết hàng 3 ===========================================================*/}

          {/* Hàng 5 ===========================================================*/}
          <div className="grid grid-cols-4 gap-5">
            {/* <Form.Item label="Nhà cung cấp" name="provider_id" className="mb-5">
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
            </Form.Item> */}
            {/* <Form.Item
              label="Hãng sản xuất"
              name="manufacturer_id"
              // required
              // rules={[
              //   {
              //     required: true,
              //     message: 'Hãy nhập hãng sản xuất của thiết bị!',
              //   },
              // ]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập hãng sản xuất của thiết bị"
                allowClear
                className="input"
              />
            </Form.Item> */}

            {/* <Form.Item
                label="Năm sản xuất"
                name="year_of_manufacture"
                required
                rules={[
                  {
                    required: true,
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
              </Form.Item> */}
          </div>
          {/* hết Hàng 5 ===========================================================*/}

          {/* Hàng 6 ===========================================================*/}
          {/* <div className="grid grid-cols-4 gap-5">
            <Form.Item
              label="Bảo dưỡng định kỳ (tháng)"
              name="regular_maintenance"
              className="mb-5"
            >
              <Select
                showSearch
                placeholder="Chọn số tháng"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Option value="6">6 tháng</Option>
                <Option value="12">12 tháng</Option>
                <Option value="24">24 tháng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Kiểm định định kỳ (tháng)"
              name="regular_inspection"
              className="mb-5"
            >
              <Select
                showSearch
                placeholder="Chọn số tháng"
                allowClear
                // optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Option value="6">6 tháng</Option>
                <Option value="12">12 tháng</Option>
                <Option value="24">24 tháng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày nhập kho"
              name="warehouse_import_date"
              className="mb-5"
            >
              <DatePicker
                className="input w-[-webkit-fill-available]"
                placeholder="Chọn ngày"
              />
            </Form.Item>
            <Form.Item
              label="Ngày bàn giao"
              name="handover_date"
              className="mb-5"
            >
              <DatePicker className="textarea" placeholder="Chọn ngày" />
            </Form.Item>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-5">
            <Form.Item label="Dự án" name="project_id" className="mb-5">
              <Select
                showSearch
                placeholder="Chọn dự án"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={options(projects)}
              />
            </Form.Item>
          </div> */}
          {/* hết Hàng 8 ===========================================================*/}

          {/* Hàng 9 ===========================================================*/}
          {/* <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Thông số kĩ thuật"
              name="technical_parameter"
              className="mb-5"
            >
              <TextArea
                placeholder="Thông số kĩ thuật"
                rows={4}
                className="textarea"
              />
            </Form.Item>
            <Form.Item
              label="Cấu hình kĩ thuật"
              name="configuration"
              className="mb-5"
            >
              <TextArea
                placeholder="Cấu hình kĩ thuật"
                rows={4}
                className="textarea"
              />
            </Form.Item>
          </div> */}
          <div className="grid grid-cols-1 gap-5">
            {/* <Form.Item
              label="Quy trình sử dụng"
              name="usage_procedure"
              className="mb-5"
            >
              <TextArea
                placeholder="Quy trình sử dụng"
                rows={4}
                className="textarea"
              />
            </Form.Item> */}
            <Form.Item label="Ghi chú" name="note" className="mb-5">
              <TextArea placeholder="Ghi chú" rows={4} className="textarea" />
            </Form.Item>
          </div>
          {/* hết Hàng 9 ===========================================================*/}
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
          {/* </label> */}
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
