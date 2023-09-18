import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Select, Image } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, formatCurrency } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import Loading from 'components/Loading';
import categoryApi from 'api/category.api';

const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { TextArea } = Input;

const UpdateEquipment = () => {
  const { types, statuses, departments, units, levels, projects, providers } =
    useContext(FilterContext);

  const options = (array: any) => {
    return array.map((item: any) => {
      let o: any = {};
      o.value = item.id;
      o.label = item.name;
      return o;
    });
  };

  const navigate = useNavigate();
  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataChange, setDataChange] = useState<any>({});
  const [equipment, setEquipment] = useState<any>({});
  const [type, setType] = useState({});

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const getDetailEquipment = (id: any) => {
    setLoading(true);
    equipmentApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let equipment = data.equipment;
        if (success) {
          form.setFieldsValue({
            id: equipment.id,
            name: equipment.name,
            hash_code: equipment.hash_code,
            model: equipment.model,
            serial: equipment.serial,
            status_id: equipment.status_id,
            unit: equipment.unit,
            unit_id: equipment.unit_id,
            type_id: equipment.type_id,
            risk_level: equipment.risk_level,
            year_in_use: equipment.year_in_use,
            fixed_asset_number: equipment.fixed_asset_number,
            quantity: equipment.quantity,
            initial_value: equipment.initial_value,
            annual_depreciation: equipment.annual_depreciation,
            residual_value: equipment.residual_value,
            image: equipment.image,
            // year_of_manufacture: equipment.year_of_manufacture,
            // import_price: equipment.import_price,
            department_id: equipment.department_id,
            manufacturer_id: equipment.manufacturer_id,
            manufacturing_country_id: equipment.manufacturing_country_id,
            configuration: equipment.configuration,
            technical_parameter: equipment.technical_parameter,
            usage_procedure: equipment.usage_procedure,
            note: equipment.note,
            provider_id: equipment.provider_id,
            project_id: equipment.project_id,
            handover_date:
              equipment.handover_date !== null
                ? moment(equipment.handover_date)
                : equipment.handover_date,
            regular_maintenance: equipment.regular_maintenance, //bao duong dinh ki (6,12,24 thang)
            regular_inspection: equipment.regular_inspection, //bao duong dinh ki (6,12,24 thang)
            warehouse_import_date:
              equipment.warehouse_import_date !== null
                ? moment(equipment.warehouse_import_date)
                : equipment.warehouse_import_date,
          });
          setEquipment(equipment);
          setImage(equipment.image);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  // console.log(equipment.department_id);
  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);

  const onFinish = (values: any) => {
    const data = { ...values, image };
    console.log(data);
    setLoadingUpdate(true);
    equipmentApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật thiết bị thành công');
          navigate(`/equipment/detail/${equipment.id}`);
        } else {
          toast.error('Cập nhật thiết bị thất bại');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
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

  const onchange = (e: any) => {
    const newDataChange = { ...dataChange, [e.target.id]: e.target.value };
    console.log(newDataChange);
    setDataChange(newDataChange);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬT THIẾT BỊ</div>
      </div>

      <Divider />
      {loading ? (
        <Loading />
      ) : (
        // <div className="flex-between mt-10">
        <div className="flex flex-row gap-6 my-8">
          <Form
            form={form}
            className="basis-3/4 "
            layout="vertical"
            size="large"
            onFinish={onFinish}
            onChange={onchange}
          >
            <Form.Item name="id" className="mb-5 hidden ">
              <Input className="input" />
            </Form.Item>

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
                name="department_id"
                className="mb-5"
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
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Trạng thái thiết bị"
                name="status_id"
                required
                rules={[
                  { required: true, message: 'Hãy chọn trạng thái thiết bị!' },
                ]}
                className="mb-5"
              >
                <Select
                  showSearch
                  placeholder="Chọn trạng thái thiết bị"
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={options(statuses)}
                  disabled
                />
              </Form.Item>
            </div>
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
                <Input
                  placeholder="Nhập mã hoá thiết bị"
                  allowClear
                  className="input"
                />
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
            <div className="grid grid-cols-4 gap-5">
              {/* <Form.Item label="Nhóm thiết bị" name="group_id" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn nhóm thiết bị"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(groups)}
                onChange={onChangeGroup}
              />
            </Form.Item> */}
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
              <Form.Item
                label="Thành tiền"
                name="initial_value"
                className="mb-5"
              >
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
              {/* <Form.Item
                label="Mức độ rủi ro"
                name="risk_level"
                className="mb-5"
              >
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
            </div>
            <div className="grid grid-cols-4 gap-5">
              {/* <Form.Item label="Số lượng" name="quantity" className="mb-5">
                <Input
                  placeholder="Nhập số lượng thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item> */}
            </div>

            <div className="grid grid-cols-4 gap-5">
              <Form.Item
                label="Năm sử dụng"
                name="year_in_use"
                className="mb-5"
              >
                <Input
                  placeholder="Nhập năm sử dụng của thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item>
              {/* <Form.Item
                label="Nhà cung cấp"
                name="provider_id"
                className="mb-5"
              >
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
            <div className="grid grid-cols-2 gap-5">
              {/* <Form.Item
                label="Kiểm xạ định kỳ"
                name="regular_radiation_monitoring"
                className="mb-5"
              >
                <Select
                  showSearch
                  placeholder="Chọn tháng"
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
              </Form.Item> */}
            </div>
            <div className="grid grid-cols-4 gap-5">
              {/* <Form.Item
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
              </Form.Item> */}

              {/* <Form.Item
                label="Ngày bảo dưỡng gần nhất"
                name="lastest_maintenance"
                className="mb-5"
              >
                <DatePicker
                  className="input w-[-webkit-fill-available]"
                  placeholder="Chọn ngày"
                  format={dateFormat}
                />
              </Form.Item> */}
              {/* <Form.Item
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
              </Form.Item> */}
              {/* <Form.Item
                label="Ngày kiểm định gần nhất"
                name="lastest_inspection"
                className="mb-5"
              >
                <DatePicker
                  className="input w-[-webkit-fill-available]"
                  placeholder="Chọn ngày"
                />
              </Form.Item> */}

              {/* <Form.Item
                label="Ngày kiểm xạ gần nhất"
                name="lastest_check"
                className="mb-5"
              >
                <DatePicker
                  className="input w-[-webkit-fill-available]"
                  placeholder="Chọn ngày"
                />
              </Form.Item> */}
            </div>
            <div className="grid grid-cols-4 gap-5">
              {/* <Form.Item
                  label="Ngày hết hạn bảo hành"
                  name="expire_insurance"
                  className="mb-5"
                >
                  <DatePicker
                    className="input w-[-webkit-fill-available]"
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày nhập thông tin"
                  name="createAt"
                  className="mb-5"
                >
                  <DatePicker className="textarea" placeholder="Chọn ngày" />

                
                </Form.Item> */}
              {/* <Form.Item
                label="Thời điểm kết thúc hợp đồng LDLK"
                name="expire_contract"
                className="mb-5"
              >
                <DatePicker
                  className="input w-[-webkit-fill-available]"
                  placeholder="Chọn ngày"
                />
              </Form.Item> */}
            </div>

            <div className="grid grid-cols-3 gap-5">
              {/* <Form.Item
                label="Giá trị ban đầu"
                name="initial_value"
                className="mb-5"
              >
                <Input
                  placeholder="Nhập giá trị ban đầu của thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item> */}

              {/* <Form.Item
                label="Giá trị hiện tại"
                name="present_price"
                className="mb-5"
              >
                <Input
                  placeholder="Nhập giá trị hiện tại của thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item> */}
            </div>
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
            <div className="grid grid-cols-1 gap-5">
              {/* <Form.Item
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
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Form.Item
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
                <TextArea placeholder="Ghi chứ" rows={4} className="textarea" />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                htmlType="submit"
                className="button-primary"
                loading={loadingUpdate}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
          <div className="flex flex-col gap-4 items-center basis-1/4 ">
            <div className="text-center leading-9 ">Hình ảnh thiết bị</div>

            {selectedImage === '' ? (
              <img
                src={image !== null ? image : ava}
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
            <div className="mt-6">Thay đổi hình ảnh thiết bị</div>
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
  );
};

export default UpdateEquipment;
