import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { convertBase64, options } from 'utils/globalFunc.util';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import equipmentInspection from 'api/equipment_inspection.api';
import { FilterContext } from 'contexts/filter.context';
const mdParser = new MarkdownIt(/* Markdown-it options */);

const ModalInspection = (props: any) => {
  const {
    showInspectionModal,
    setShowInspectionModal,
    callback,
    dataInspection,
  } = props;

  const { providers } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<any>('');
  const [html, setHtml] = useState<any>('');
  const [text, setText] = useState<any>('');

  const handleChangeFile = async (e: any) => {
    let file = e.target.files[0];
    if (file.size > 1000000) {
      form.resetFields(['file']);
      form.setFields([
        {
          name: 'file',
          errors: ['Vui lòng chọn file có dung lượng nhỏ hơn 1MB!'],
        },
      ]);
      return;
    } else {
      let fileBase64 = await convertBase64(file);
      setFile(fileBase64);
    }
  };

  useEffect(() => {
    if (Object.keys(dataInspection).length === 0) return;
    form.setFieldsValue({
      name: dataInspection.name,
      equipment_id: dataInspection.equipment_id,
      department_id: dataInspection.department_id,
      department: dataInspection?.department,
      inspection_create_user_id: dataInspection?.inspection_create_user_id,
    });
  }, [dataInspection]);

  const inspectEquipment = (values: any) => {
    setLoading(true);
    const data: any = {
      ...values,
      inspection_date: moment(new Date(values?.inspection_date)).toISOString(),
      file,
      html,
      text,
      isEdit: 0,
    };
    equipmentInspection
      .inspectEquipment(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Tạo phiếu kiểm định thiết bị thành công!');
          form.resetFields();
          setHtml('');
          setText('');
          callback();
        } else {
          toast.error('Tạo phiếu kiểm định thiết bị thất bại!');
        }
      })
      .catch()
      .finally(() => {
        setLoading(false);
        setShowInspectionModal(false);
      });
  };

  const handleChange = ({ html, text }: any) => {
    setHtml(html);
    setText(text);
  };

  return (
    <Modal
      title="Kiểm định thiết bị"
      open={showInspectionModal}
      onCancel={setShowInspectionModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={inspectEquipment}
      >
        <Form.Item
          name="equipment_id"
          required
          style={{ display: 'none' }}
        ></Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item name="department_id" className="hidden" required></Form.Item>
        <Form.Item label="Khoa - Phòng" name="department">
          <Input className="input" disabled />
        </Form.Item>
        <Form.Item
          label="Ngày Kiểm định"
          name="inspection_date"
          rules={[
            {
              required: true,
              message: 'Hãy chọn Ngày Kiểm định!',
            },
          ]}
        >
          <DatePicker className="date" />
        </Form.Item>
        <Form.Item
          label="Nhà cung cấp dịch vụ"
          name="provider_id"
          rules={[
            {
              required: true,
              message: 'Hãy chọn Nhà cung cấp dịch vụ!',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Chọn nhà cung cấp dịch vụ"
            optionFilterProp="children"
            options={options(providers)}
            allowClear
          />
        </Form.Item>
        <Form.Item
          className="fileUploadInput"
          name="file"
          label="Tài liệu đính kèm"
        >
          <Input type="file" onChange={(e: any) => handleChangeFile(e)} />
        </Form.Item>
        <div>
          <div className="mb-4">Nội dung kiểm định</div>
          <MdEditor
            style={{ height: '500px' }}
            renderHTML={(text: string) => mdParser.render(text)}
            onChange={handleChange}
          />
        </div>

        <Form.Item
          name="inspection_create_user_id"
          className="hidden"
        ></Form.Item>
        <div className="flex flex-row justify-end gap-4 mt-4">
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className="button-primary"
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => setShowInspectionModal(false)}
              className="button-primary"
            >
              Đóng
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalInspection;
