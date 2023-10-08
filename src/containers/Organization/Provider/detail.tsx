import { Button, Divider, Form, Input, Select } from 'antd';
import providerApi from 'api/provider.api';
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';
import ava from 'assets/image.png';
import { FilterContext } from 'contexts/filter.context';

const DetailProvider = () => {

  const { services } = useContext(FilterContext);
  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);

  const options: any = services.map((item: any) => {
    let o: any = {};
    o.value = item.id;
    o.label = item.name;
    return o;
  })

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  }

  const getDetail = () => {
    providerApi.detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let provider = data.provider;
        if (success) {
          form.setFieldsValue({
            id: provider.id,
            name: provider.name,
            tax_code: provider.tax_code,
            hotline: provider.hotline,
            email: provider.email,
            contact_person: provider.contact_person,
            note: provider.note,
            address: provider.address
          })
        }
      })
      .catch()
  }

  const onFinish = (values: any) => {
    setLoading(true);
    providerApi.update(values)
      .then((res) => {
        const { success } = res.data;
        if (success) {
          toast.success("Cập nhật khoa-phòng thành công!");
        }
      })
      .catch(() => toast.error("Cập nhật khoa - phòng thất bại!"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getDetail();
  }, [id])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CHI TIẾT KHOA PHÒNG</div>
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
          <Form.Item
            name="id"
            required
            style={{ display: "none" }}
          >
            <Input style={{ display: "none" }} />
          </Form.Item>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Tên nhà cung cấp"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên nhà cung cấp!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập tên nhà cung cấp"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label="Mã số thuế"
              name="tax_code"
              className='mb-5'
            >
              <Input
                placeholder="Nhập mã số thuế"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>

          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Lĩnh vực hoạt động"
              name="services"
              required
              rules={[
                { required: true, message: 'Hãy chọn lĩnh vực hoạt động!' },
              ]}
              className='mb-5'
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Hãy chọn lĩnh vực hoạt động"
                options={options}
                defaultValue={['1']}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              required
              rules={[
                { required: true, message: 'Hãy nhập email!' },
                { type: 'email', message: 'Nhập đúng định dạng email' }
              ]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập email"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Liên hệ"
              name="hotline"
              // required
              // rules={[{ required: true, message: 'Hãy nhập liên hệ!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập liên hệ"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              // required
              // rules={[{ required: true, message: 'Hãy nhập địa chỉ!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập địa chỉ"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Người liên hệ"
              name="contact_person"
              // required
              // rules={[{ required: true, message: 'Hãy nhập liên hệ!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập tên"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label="Ghi chú"
              name="note"
              // required
              // rules={[{ required: true, message: 'Hãy nhập địa chỉ!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập ghi chú"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className='button-primary'
            >
              Thêm
            </Button>
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
                  <img
                    src={ava}
                    alt="ava"
                    className='w-52 h-52'
                  /> :
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

export default DetailProvider