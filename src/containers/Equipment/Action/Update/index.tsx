import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import Loading from 'components/Loading';
const { TextArea } = Input;

const UpdateEquipment = () => {
  const { statuses, departments, units } = useContext(FilterContext);

  const options = (array: any) => {
    return array?.map((item: any) => {
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
            model: equipment.model,
            serial: equipment.serial,
            status_id: equipment.status_id,
            unit_id: equipment.unit_id,
            year_in_use: equipment.year_in_use,
            fixed_asset_number: equipment.fixed_asset_number,
            initial_value: equipment.initial_value,
            annual_depreciation: equipment.annual_depreciation,
            residual_value: equipment.residual_value,
            image: equipment.image,
            department_id: equipment.department_id,
            year_of_manufacture: equipment.year_of_manufacture,
            manufacturing_country_id: equipment.manufacturing_country_id,
            note: equipment.note,
            handover_date:
              equipment.handover_date !== null
                ? moment(equipment.handover_date)
                : equipment.handover_date,
          });
          setEquipment(equipment);
          setImage(equipment.image);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);

  const onFinish = (values: any) => {
    const data = { ...values, image };
    setLoadingUpdate(true);
    equipmentApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật thiết bị thành công');
          navigate(`/equipment/detail/${equipment.id}`);
        } else {
          toast.error(res.data.message || 'Cập nhật thiết bị thất bại');
        }
      })
      .catch((error) => {
        toast.error(error.message || 'Cập nhật thiết bị thất bại');
      })
      .finally(() => setLoadingUpdate(false));
  };

  const onchange = (e: any) => {
    const newDataChange = { ...dataChange, [e.target.id]: e.target.value };
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
            <div className="flex justify-between gap-5">
              <Form.Item
                label="Tên thiết bị"
                name="name"
                required
                rules={[{ required: true, message: 'Hãy nhập tên thiết bị!' }]}
                className="mb-5 w-1/2"
              >
                <Input
                  placeholder="Nhập tên thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item>
              <div className="flex gap-20">
                <Form.Item label="Khoa - Phòng" className="mb-5 w-fit">
                  <p className="text-lg">{equipment?.Department?.name}</p>
                </Form.Item>
                <Form.Item label="Trạng thái thiết bị" className="mb-5 w-fit">
                  <p className="text-lg">{equipment?.Equipment_Status?.name}</p>
                </Form.Item>
              </div>
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
              <Form.Item label="Model" name="model" className="mb-5">
                <Input
                  placeholder="Nhập model của thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item>
              <Form.Item label="Serial" name="serial" className="mb-5">
                <Input
                  placeholder="Nhập serial của thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item>
              <Form.Item
                label="Đơn vị tính"
                name="unit_id"
                required
                rules={[{ required: false, message: 'Hãy nhập đơn vị tính!' }]}
                className="mb-5"
              >
                <Select
                  showSearch
                  placeholder="Chọn đơn vị"
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={options(units)}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-4 gap-x-5">
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
              <Form.Item
                label="Nước sản xuất"
                name="manufacturing_country_id"
                className="mb-5"
              >
                <Input
                  placeholder="Nhập xuất sứ của thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item>
              <Form.Item
                label="Giá trị nhập"
                name="initial_value"
                className="mb-5"
              >
                <InputNumber
                  min={0}
                  placeholder="Nhập giá trị thiết bị"
                  className="input w-full flex items-center"
                  formatter={(value) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }}
                  precision={0}
                />
              </Form.Item>
              <Form.Item
                label="Khấu hao hàng năm (%)"
                name="annual_depreciation"
                className="mb-5"
              >
                <InputNumber
                  min={0}
                  max={100}
                  className="input w-full flex items-center"
                  placeholder="Nhập khấu hao"
                  formatter={(value) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }}
                  precision={0}
                />
              </Form.Item>
              <Form.Item
                label="Giá trị còn lại"
                name="residual_value"
                className="mb-5"
              >
                <InputNumber
                  min={0}
                  placeholder="Nhập giá trị còn lại"
                  className="input w-full flex items-center"
                  formatter={(value) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }}
                  precision={0}
                />
              </Form.Item>
              <Form.Item
                label="Năm sản xuất"
                name="year_of_manufacture"
                rules={[
                  {
                    required: false,
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
              </Form.Item>
              <Form.Item
                label="Ngày bàn giao"
                name="handover_date"
                className="mb-5"
              >
                <DatePicker className="textarea" placeholder="Chọn ngày" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-3 gap-5"></div>
            <div className="grid grid-cols-1 gap-5">
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
                src={image ? image : ava}
                alt="Hình ảnh thiết bị"
                className="w-52 h-52  rounded-lg"
              />
            ) : (
              <div
                className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${selectedImage})` }}
              ></div>
            )}
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
