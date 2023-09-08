import { Button, Divider, Form, Input } from 'antd';
import { useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { toast } from 'react-toastify';
import categoryApi from 'api/category.api';

const CreateEquipmentGroup = () => {

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

  const onFinish = (values: any) => {
    setLoading(true);
    categoryApi.createGroup(values)
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          form.resetFields();
          toast.success("Thêm mới thành công!");
        } else  {
          toast.error(message)
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">THÊM MỚI NHÓM THIẾT BỊ</div>
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
              label="Tên nhóm thiết bị"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên nhóm thiết bị!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập tên nhóm thiết bị"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label="Mã nhóm thiết bị"
              required
              rules={[{ required: true, message: 'Hãy nhập tên mã thiết bị!' }]}
              name="alias"
              className='mb-5'
            >
              <Input
                placeholder="Nhập mã nhóm thiết bị"
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

export default CreateEquipmentGroup