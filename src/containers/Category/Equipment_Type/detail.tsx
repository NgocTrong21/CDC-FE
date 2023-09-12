import { Button, Divider, Form, Input, Select } from 'antd';
import categoryApi from 'api/category.api';
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';
import ava from 'assets/image.png';
import { FilterContext } from 'contexts/filter.context';

const DetailEquipmentType = () => {

  const { groups } = useContext(FilterContext);

  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);

  const options: any = groups?.map((item: any) => {
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
    categoryApi.detailType(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let type = data.type;
        if (success) {
          form.setFieldsValue({
            id: type.id,
            name: type.name,
            alias: type.alias,
            group_id: type.group_id
          })
        }
      })
      .catch()
  }

  const onFinish = (values: any) => {
    setLoading(true);
    categoryApi.updateType(values)
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
        <div className="title">CHI TIẾT LOẠI THIẾT BỊ</div>
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
            name="id"
            required
            style={{ display: "none" }}
          >
            <Input style={{ display: "none" }} />
          </Form.Item>
          <div className='grid grid-cols-2 gap-5'>
            <Form.Item
              label="Tên loại thiết bị"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên loại thiết bị!' }]}
              className='mb-5'
            >
              <Input
                placeholder="Nhập tên loại thiết bị"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
            <Form.Item
              label="Mã loại thiết bị"
              required
              rules={[{ required: true, message: 'Hãy nhập tên mã loại thiết bị!' }]}
              name="alias"
              className='mb-5'
            >
              <Input
                placeholder="Nhập mã loại thiết bị"
                allowClear
                className='rounded-lg h-9 border-[#A3ABEB] border-2'
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Nhóm thiết bị"
            name="group_id"
            required
            rules={[{ required: true, message: 'Hãy chọn Nhóm thiết bị!' }]}
            className='mb-5'
          >
            <Select
              placeholder="Chọn Nhóm thiết bị"
              options={options}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className='button-primary'
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

export default DetailEquipmentType