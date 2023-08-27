import { Button, Divider, Form, Input } from 'antd';
import categoryApi from 'api/category.api';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';
import ava from 'assets/image.png';

const DetailEquipmentUnit = () => {

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

  const getDetail = () => {
    categoryApi.detailUnit(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let unit = data.unit;
        if (success) {
          form.setFieldsValue({
            id: unit.id,
            name: unit.name,
          })
        }
      })
      .catch()
  }

  const onFinish = (values: any) => {
    setLoading(true);
    categoryApi.updateGroup(values)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success("Cập nhật thành công!");
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getDetail();
  }, [id])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CHI TIẾT ĐƠN VỊ TÍNH</div>
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
          <Form.Item
            label="Tên đơn vị tính"
            name="name"
            required
            rules={[{ required: true, message: 'Hãy nhập tên đơn vị tính!' }]}
            className='mb-5'
          >
            <Input
              placeholder="Nhập tên đơn vị tính"
              allowClear
              className='rounded-lg h-9 border-[#A3ABEB] border-2'
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className='button'
            >
              Cập nhật
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

export default DetailEquipmentUnit