import { Button, Divider, Form, Input, Select } from 'antd';
import departmentApi from 'api/department.api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertBase64 } from 'utils/globalFunc.util';
import ava from 'assets/image.png';
import { Pie } from '@ant-design/plots';
import Loading from 'components/Loading';
import User from 'containers/User';

const DetailDepartment = () => {
  const navigate = useNavigate();
  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [countStatus, setCountStatus] = useState<any>([]);
  const [countLevel, setCountLevel] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [headId, setHeadId] = useState<any>();
  const [chiefId, setChiefId] = useState<any>();
  const [triggerLoading, setTriggerLoading] = useState(false);

  const options = (array: any) => {
    return (
      array?.length > 0 &&
      array?.map((item: any) => {
        let o: any = {};
        o.value = item?.id;
        o.label = item?.name;
        return o;
      })
    );
  };

  const data_status = countStatus?.length > 0 ? countStatus : [];
  const config_status: any = {
    appendPadding: 10,
    data: data_status,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const data_level = countLevel?.length > 0 ? countLevel : [];
  const config_level: any = {
    appendPadding: 10,
    data: data_level,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const getDetailDepartment = () => {
    setLoading(true);
    departmentApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        const department = data.department;
        setUsers(department?.Users);
        const head = department?.Users?.find(
          (user: any) => user?.Role?.id === 6 || user?.Role?.id === 7
        );
        setHeadId(head.id);
        const chief = department?.Users?.find(
          (user: any) => user?.Role?.id === 4 || user?.Role?.id === 8
        );
        setChiefId(chief.id);

        if (success) {
          form.setFieldsValue({
            id: department.id,
            name: department.name,
            alias: department.alias,
            phone: department.phone,
            email: department.email,
            head_of_department_id: head?.id,
            chief_nursing_id: chief?.id,
          });
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  const statisticEquipmentByDepartment = () => {
    departmentApi.statisticEquipmentByDepartment(id)
      .then((res: any) => {
        const { data } = res.data;
        setCountLevel(data.count_level);
        setCountStatus(data.count_status);
      })
      .catch()
  }

  const onFinish = (values: any) => {
    const data = { ...values, prevHeadId: headId, prevChiefId: chiefId };
    setLoadingUpdate(true);
    departmentApi
      .update(data)
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Cập nhật thành công!');
          setTriggerLoading(!triggerLoading);
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  useEffect(() => {
    getDetailDepartment();
    statisticEquipmentByDepartment();
  }, [id]);

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CHI TIẾT KHOA PHÒNG</div>
      </div>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div>
            <div className="title text-center">THÔNG TIN CHUNG</div>
            <div className="flex-between mt-10">
              <Form
                form={form}
                className="basis-2/3"
                layout="vertical"
                size="large"
                onFinish={onFinish}
              >
                <div className="grid grid-cols-2 gap-5">
                  <Form.Item name="id" required style={{ display: 'none' }}>
                    <Input style={{ display: 'none' }} />
                  </Form.Item>
                  <Form.Item
                    label="Tên khoa - phòng"
                    name="name"
                    required
                    rules={[
                      { required: true, message: 'Hãy nhập tên khoa - phòng!' },
                    ]}
                    className="mb-5"
                  >
                    <Input
                      placeholder="Nhập tên khoa - phòng"
                      allowClear
                      className="input"
                    />
                  </Form.Item>
                  <Form.Item label="Alias" name="alias" className="mb-5">
                    <Input
                      placeholder="Nhập alias"
                      allowClear
                      className="input"
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    required
                    rules={[
                      { required: true, message: 'Hãy nhập số điện thoại!' },
                    ]}
                    className="mb-5"
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      allowClear
                      className="input"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    required
                    rules={[{ required: true, message: 'Hãy nhập email!' }]}
                    className="mb-5"
                  >
                    <Input
                      placeholder="Nhập email"
                      allowClear
                      className="input"
                    />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Form.Item
                    label="Trưởng khoa"
                    name="head_of_department_id"
                    className="mb-5"
                  >
                    <Select
                      placeholder="Chọn tên"
                      allowClear
                      options={options(users)}
                    />
                  </Form.Item>
                  {/* <Form.Item
                    label="Điều dưỡng trưởng/Phụ trách phòng Vật tư"
                    name="chief_nursing_id"
                    className="mb-5"
                  >
                    <Select
                      placeholder="Chọn tên"
                      allowClear
                      options={options(users)}
                    />
                  </Form.Item> */}
                </div>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    loading={loadingUpdate}
                    className="button-primary"
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
              <div className="basis-1/3 mt-4 flex flex-col items-center">
                <div className="text-center mb-4">Ảnh đại diện</div>
                <div className="preview-content">
                  <input
                    type="file"
                    hidden
                    className="form-control"
                    id="inputImage"
                    onChange={(e: any) => handleChangeImg(e)}
                  />
                  <label className="text-center" htmlFor="inputImage">
                    {image === '' ? (
                      <img src={ava} alt="ava" className="w-52 h-52" />
                    ) : (
                      <div
                        className="w-52 h-52 bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: `url(${selectedImage})` }}
                      ></div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mb-8">
            <div className="title text-center">
              THỐNG KÊ THIẾT BỊ THEO TRẠNG THÁI
            </div>
            <Pie
              {...config_status}
              onReady={(plot) => {
                plot.on('plot:click', (evt: any) => {
                  const { data } = evt;
                  navigate(
                    `/equipment/list_eq?page_search=1&status_id=${data?.data?.status_id}&department_id=${id}`
                  );
                });
              }}
            />
          </div>

          <div className="mb-8">
            <div className="title text-center">
              THỐNG KÊ THIẾT BỊ THEO MỨC ĐỘ RỦI RO
            </div>
            <Pie
              {...config_level}
              onReady={(plot) => {
                plot.on('plot:click', (evt: any) => {
                  const { data } = evt;
                  navigate(
                    `/equipment/list_eq?page_search=1&risk_level=${data?.data?.risk_level}&department_id=${id}`
                  );
                });
              }}
            />
          </div> */}
          {/* <div>
            <div className="title text-center">DANH SÁCH NHÂN VIÊN</div>
            <User department_id={id} isDepartment={true} triggerLoading = {triggerLoading}/>
          </div> */}
        </>
      )}
    </div>
  );
};

export default DetailDepartment;
