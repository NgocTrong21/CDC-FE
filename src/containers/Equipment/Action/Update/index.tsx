import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';

const dateFormat = "YYYY/MM/DD";
const { Option } = Select;
const { TextArea } = Input;

const UpdateEquipment = () => {

  const { types, statuses, departments, units, levels } = useContext(FilterContext);
  const options = (array: any) => {
    return array.map((item: any) => {
      let o: any = {};
      o.value = item.id;
      o.label = item.name;
      return o;
    })
  }
  const navigate = useNavigate();
  const params: any = useParams();
  const { id } = params;
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
  }

  const getDetail = (id: number) => {
    equipmentApi.detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let equipment = data.equipment;
        if (success) {
          form.setFieldsValue({
            id: equipment.id,
            name: equipment.name,
            code: equipment.code,
            model: equipment.model,
            serial: equipment.serial,
            status_id: equipment.status_id,
            unit_id: equipment.unit_id,
            type_id: equipment.type_id,
            risk_level: equipment.risk_level,
            year_in_use: equipment.year_in_use,
            year_of_manufacture: equipment.year_of_manufacture,
            import_price: equipment.import_price,
            department_id: equipment.department_id,
            manufacturer_id: equipment.manufacturer_id,
            manufacturing_country_id: equipment.manufacturing_country_id,
            warehouse_import_date: moment(equipment.warehouse_import_date)
          })
          setImage(equipment?.image);
          setSelectedImage(equipment?.image);
        }
      })
      .catch()
  }

  useEffect(() => {
    getDetail(id)
  }, [id])

  const onFinish = (values: any) => {
    let data = { ...values, image };
    setLoading(true);
    equipmentApi.update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success("Cập nhật thiết bị thành công")
        } else {
          toast.error("Cập nhật thiết bị thất bại");
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  const onchange = (value: any) => {
    console.log('value', moment(value._d).toISOString())
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬP THIẾT BỊ</div>
        <Button className="button_excel">
          <ImportOutlined />
          <div
            className="font-medium text-md text-[#5B69E6]"
            onClick={() => navigate('/equipment/import_excel_eq')}
          >Nhập Excel</div>
        </Button>
      </div>
      <Divider />
      <div className='flex-between mt-10'>
        <Form
          form={form}
          className='basis-2/3'
          layout="vertical"
          size="large"
          onFinish={onFinish}
        >
          <Form.Item name="id" className='mb-5 hidden'>
            <Input className='rounded-lg h-9 border-[#A3ABEB] border-2 hidden'/>
          </Form.Item>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item
              label="Tên thiết bị"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập tên thiết bị" allowClear className='input'/>
            </Form.Item>
            <Form.Item
              label="Trạng thái thiết bị"
              name="status_id"
              required
              rules={[{ required: true, message: 'Hãy chọn trạng thái thiết bị!' }]}
              className='mb-5'
            >
              <Select
                showSearch
                placeholder="Chọn trạng thái thiết bị"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(statuses)}
              />
            </Form.Item>
            <Form.Item label="Mức độ rủi ro" name="risk_level" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn mức độ rủi ro"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(levels)}
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item
              label="Mã thiết bị"
              name="code"
              required
              rules={[{ required: true, message: 'Hãy nhập mã thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập mã thiết bị" allowClear className='input'/>
            </Form.Item>
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
            <Form.Item
              label="Loại thiết bị"
              name="type_id"
              required
              rules={[{ required: true, message: 'Hãy chọn loại thiết bị!' }]}
              className='mb-5'
            >
              <Select
                showSearch
                placeholder="Chọn loại thiết bị"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(types)}
              />
            </Form.Item>
           
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Đơn vị tính" name="unit_id" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn đơn vị tính"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(units)}
              />
            </Form.Item>
            <Form.Item label="Giá nhập" name="import_price" className='mb-5'>
              <Input placeholder="Nhập giá thiết bị" allowClear className='input'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item label="Nhà cung cấp" name="provider_id" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              label="Model"
              name="model"
              required
              rules={[{ required: true, message: 'Hãy nhập model của thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập model của thiết bị" allowClear className='input'/>
            </Form.Item>
            <Form.Item
              label="Serial"
              name="serial"
              required
              rules={[{ required: true, message: 'Hãy nhập serial của thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập serial của thiết bị" allowClear className='input'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item
              label="Hãng sản xuất"
              name="manufacturer_id"
              required
              rules={[{ required: true, message: 'Hãy nhập hãng sản xuất của thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập hãng sản xuất của thiết bị" allowClear className='input'/>
            </Form.Item>
            <Form.Item
              label="Xuất sứ"
              name="manufacturing_country_id"
              required
              rules={[{ required: true, message: 'Hãy nhập xuất sứ của thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập xuất sứ của thiết bị" allowClear className='input'/>
            </Form.Item>
            <Form.Item
              label="Năm sản xuất"
              name="year_of_manufacture"
              required
              rules={[{ required: true, message: 'Hãy nhập năm sản xuất của thiết bị!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập năm sản xuất của thiết bị" allowClear className='input'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item label="Bảo dưỡng định kỳ" name="regular_maintenance" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn tháng"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="6">6 tháng</Option>
                <Option value="12">12 tháng</Option>
                <Option value="24">24 tháng</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Kiểm định định kỳ" name="regular_inspection" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn tháng"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="6">6 tháng</Option>
                <Option value="12">12 tháng</Option>
                <Option value="24">24 tháng</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Kiểm xạ định kỳ" name="regular_radiation_monitoring" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn tháng"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="6">6 tháng</Option>
                <Option value="12">12 tháng</Option>
                <Option value="24">24 tháng</Option>
              </Select>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item label="Ngày bảo dưỡng gần nhất" name="lastest_maintenance" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' format={dateFormat}/>
            </Form.Item>
            <Form.Item label="Ngày kiểm định gần nhất" name="lastest_inspection" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item label="Ngày kiểm xạ gần nhất" name="lastest_check" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item label="Ngày nhập kho" name="import_date" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item label="Ngày hết hạn bảo hành" name="expire_insurance" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item label="Thời điểm kết thúc hợp đồng LDLK" name="expire_contract" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Thông số kĩ thuật" name="technical_parameter" className='mb-5'>
              <TextArea placeholder='Thông số kĩ thuật' rows={4} className='textarea'/>
            </Form.Item>
            <Form.Item label="Cấu hình kĩ thuật" name="configuration" className='mb-5'>
              <TextArea placeholder='Cấu hình kĩ thuật' rows={4} className='textarea'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item label="Giá trị ban đầu" name="initial_value" className='mb-5'>
              <Input placeholder="Nhập giá trị ban đầu của thiết bị" allowClear className='input'/>
            </Form.Item>
            <Form.Item label="Khấu hao hàng năm" name="annual_depreciation" className='mb-5'>
              <Input placeholder="Nhập Khấu hao hàng năm"allowClear className='input'/>
            </Form.Item>
            <Form.Item label="Giá trị hiện tại" name="present_price" className='mb-5'>
              <Input placeholder="Nhập giá trị hiện tại của thiết bị" allowClear className='input'/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item
              label="Khoa - Phòng"
              name="department_id"
              required
              rules={[{ required: true, message: 'Hãy chọn khoa phòng!' }]}
              className='mb-5'
            >
              <Select
                showSearch
                placeholder="Chọn khoa phòng"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(departments)}
              />
            </Form.Item>
            <Form.Item
              label="Năm sử dụng"
              name="year_in_use"
              className='mb-5'
            >
              <Input placeholder="Nhập năm sử dụng của thiết bị" allowClear className='input'/>
            </Form.Item>
            <Form.Item label="Ngày bàn giao" name="handover_date" className='mb-5'>
              <DatePicker className='textarea' placeholder='Chọn ngày' onChange={onchange}/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Dự án" name="project_id"className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn dự án"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item label="Ngày nhập thông tin" name="warehouse_import_date" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' format={dateFormat} onChange={onchange}/>
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Ghi chú" name="note" className='mb-5'>
              <TextArea placeholder='Ghi chứ' rows={4} className='textarea'/>
            </Form.Item>
            <Form.Item label="Quy trình sử dụng" name="usage_procedure" className='mb-5'>
              <TextArea placeholder='Quy trình sử dụng' rows={4} className='textarea'/>
            </Form.Item>
          </div>
          <Form.Item>
            <Button htmlType="submit" className='button' loading={loading}>Cập nhật</Button>
          </Form.Item>
        </Form>
        <div className='basis-1/3 mt-4 flex flex-col items-center'>
          <div className='text-center mb-4'>Ảnh đại diện</div>
          <div className="preview-content">
            <input
              type="file"
              hidden
              className="form-control"
              id="inputImage"
              onChange={(e: any) => handleChangeImg(e)}
            />
            <label className="text-center" htmlFor="inputImage">
              {
                image === '' ?
                  <img src={image || ava} alt="ava" className='w-52 h-52'/> :
                  <div
                    className="w-52 h-52 bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url(${selectedImage})` }}
                  >
                  </div>
              }
            </label>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UpdateEquipment