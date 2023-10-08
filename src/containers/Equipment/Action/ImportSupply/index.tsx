import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import { useEffect, useState, useContext } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import categoryApi from 'api/category.api';
import { FilterContext } from 'contexts/filter.context';
import supplyApi from 'api/suplly.api';

const { Option } = Select;
const { TextArea } = Input;

const ImportSupply = () => {

  const params: any = useParams();
  const { id } = params;
  const { levels, units, providers } = useContext(FilterContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [type, setType] = useState(null);

  const getSupplyType = () => {
    categoryApi.listSypplyType()
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setType(data?.supply_types)
        }
      })
      .catch()
  }
  useEffect(() => {
    getSupplyType();
  }, [])

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  }

  const onFinish = (values: any) => {
    let data = { ...values, image, equipment_id: id };
    supplyApi.importSupplyForEquipment(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success("Thêm mới vật tư thành công!");
          setImage('');
          setSelectedImage('');
          form.resetFields();
        } else {
          toast.error("Thêm mới vật tư thất bại!");
        }
      })
      .catch()
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP VẬT TƯ</div>
        <Button className="button_excel">
          <ImportOutlined />
          <div
            className="font-medium text-md text-[#5B69E6]"
            onClick={() => navigate('/supplies/import_excel')}
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
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Tên vật tư"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên vật tư!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập tên vật tư" allowClear className='input' />
            </Form.Item>
            <Form.Item
              label="Mã vật tư"
              name="code"
              required
              rules={[{ required: true, message: 'Hãy nhập mã vật tư!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập mã vật tư" allowClear className='input'
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Số lượng"
              name="count"
              required
              rules={[{ required: true, message: 'Hãy nhập số lượng!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập số lượng" allowClear className='input' />
            </Form.Item>
            <Form.Item
              label="Loại vật tư"
              name="type_id"
              required
              rules={[{ required: true, message: 'Hãy chọn loại vật tư!' }]}
              className='mb-5'
            >
              <Select
                showSearch
                placeholder="Chọn loại vật tư"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                options={options(type)}
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            <Form.Item
              label="Đơn vị tính"
              name="unit_id"
              required
              rules={[{ required: true, message: 'Hãy chọn đơn vị tính!' }]}
              className='mb-5'
            >
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
            <Form.Item
              label="Mức độ rủi ro"
              name="risk_level"
              required
              rules={[{ required: true, message: 'Hãy chọn mức độ rủi ro!' }]}
              className='mb-5'
            >
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
            <Form.Item label="Giá nhập" name="import_price" className='mb-5'>
              <Input placeholder="Nhập giá vật tư" allowClear className='input' />
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
                options={options(providers)}
              />
            </Form.Item>
            <Form.Item
              label="Hãng sản xuất"
              name="manufacturer"
              required
              rules={[{ required: true, message: 'Hãy nhập hãng sản xuất!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập hãng sản xuất" allowClear className='input' />
            </Form.Item>
            <Form.Item
              label="Xuất sứ"
              name="manufacturing_country"
              required
              rules={[{ required: true, message: 'Hãy nhập xuất sứ!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập xuất sứ" allowClear className='input' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Ngày nhập kho" name="warehouse_import_date" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' />
            </Form.Item>
            <Form.Item label="Ngày hết hạn bảo hành" name="expire_insurance" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Năm sản xuất"
              name="year_of_manufacture"
              required
              rules={[{ required: true, message: 'Hãy nhập năm sản xuất!' }]}
              className='mb-5'
            >
              <Input placeholder="Nhập năm sản xuất" allowClear className='input' />
            </Form.Item>
            <Form.Item label="Năm sử dụng" name="year_in_use" className='mb-5'>
              <Input placeholder="Nhập năm sử dụng" allowClear className='input' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Dự án" name="project_id" className='mb-5'>
              <Select
                showSearch
                placeholder="Chọn dự án"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="4">Thiết bị chuẩn đoán hình ảnh</Option>
                <Option value="5">Thiết bị hồi sức cấp cứu</Option>
                <Option value="6">Thiết bị lọc máu</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ngày nhập thông tin" name="warehouse_import_date" className='mb-5'>
              <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Thông số kĩ thuật" name="import_date" className='mb-5'>
              <TextArea placeholder='Thông số kĩ thuật' rows={4} className='textarea' />
            </Form.Item>
            <Form.Item label="Cấu hình kĩ thuật" name="expire_insurance" className='mb-5'>
              <TextArea placeholder='Cấu hình kĩ thuật' rows={4} className='textarea' />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item label="Ghi chú" name="note" className='mb-5'>
              <TextArea placeholder='Ghi chứ' rows={4} className='textarea' />
            </Form.Item>
            <Form.Item label="Quy trình sử dụng" name="expire_insurance" className='mb-5'>
              <TextArea placeholder='Quy trình sử dụng' rows={4} className='textarea' />
            </Form.Item>
          </div>
          <Form.Item>
            <Button className='button-primary' htmlType="submit">Thêm</Button>
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
                  <img src={ava} alt="ava" className='w-52 h-52' /> :
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

export default ImportSupply
