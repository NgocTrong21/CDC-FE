import { Button, Divider, Form, Input } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import categoryApi from 'api/category.api';

const CreateEquipmentUnit = () => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: any) => {
    setLoading(true);
    categoryApi.createUnit(values)
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          form.resetFields();
          toast.success("Thêm mới thành công!");
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">THÊM MỚI ĐƠN VỊ TÍNH</div>
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
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default CreateEquipmentUnit