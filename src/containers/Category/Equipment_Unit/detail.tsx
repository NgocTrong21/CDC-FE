import { Button, Divider, Form, Input } from 'antd';
import categoryApi from 'api/category.api';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const DetailEquipmentUnit = () => {

  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

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
    categoryApi.updateUnit(values)
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
              className='button-primary'
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default DetailEquipmentUnit