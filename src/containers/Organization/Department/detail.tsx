import { Button, Divider, Form, Input, Select } from 'antd';
import departmentApi from 'api/department.api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkPermission, convertBase64 } from 'utils/globalFunc.util';
import ava from 'assets/image.png';
import { Pie } from '@ant-design/plots';
import Loading from 'components/Loading';
import User from 'containers/User';
import { permissions } from 'constants/permission.constant';

const DetailDepartment = () => {
  const navigate = useNavigate();
  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [department, setDepartment] = useState<any>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [countStatus, setCountStatus] = useState<any>([]);
  const [countLevel, setCountLevel] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [headId, setHeadId] = useState<any>();
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
        setHeadId(head?.id);
        if (success) {
          setDepartment({
            id: department?.id,
            name: department?.name,
            alias: department?.alias,
            phone: department?.phone,
            email: department?.email,
            head_of_department_id: head?.id,
          });
          form.setFieldsValue({
            id: department?.id,
            name: department?.name,
            alias: department?.alias,
            phone: department?.phone,
            email: department?.email,
            head_of_department_id: head?.id,
          });
          setImage(department?.image);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  const statisticEquipmentByDepartment = () => {
    departmentApi
      .statisticEquipmentByDepartment(id)
      .then((res: any) => {
        const { data } = res.data;
        setCountLevel(data.count_level);
        setCountStatus(data.count_status);
      })
      .catch();
  };

  const onFinish = (values: any) => {
    const data = { ...values, prevHeadId: headId, image };
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
              {checkPermission(permissions.DEPARTMENT_UPDATE) ? (
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
                        {
                          required: true,
                          message: 'Hãy nhập tên khoa - phòng!',
                        },
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
                      className={`${
                        checkPermission(permissions.DEPARTMENT_UPDATE)
                          ? 'button-primary'
                          : 'hidden'
                      }`}
                    >
                      Cập nhật
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-5">
                    {/* <Form.Item name="id" required style={{ display: 'none' }}>
                      <Input style={{ display: 'none' }} />
                    </Form.Item> */}
                    <p>Tên khoa - phòng</p>
                    <p className="mb-5">{department?.name}</p>
                    <p>Alias</p>
                    <p className="mb-5">{department?.alias}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <p>Số điện thoại</p>
                    <p className="mb-5">{department?.phone}</p>
                    <p>Email</p>
                    <p className="mb-5">{department?.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <p>Trưởng khoa</p>
                    {options(users)?.length > 0 &&
                    options(users)?.length > 0 ? (
                      <p className="mb-5">
                        {
                          options(users).find(
                            (item: any) =>
                              item?.id === department?.head_of_department_id
                          )?.label
                        }
                      </p>
                    ) : (
                      <></>
                    )}
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
                      className={`${
                        checkPermission(permissions.DEPARTMENT_UPDATE)
                          ? 'button-primary'
                          : 'hidden'
                      }`}
                    >
                      Cập nhật
                    </Button>
                  </Form.Item>
                </div>
              )}
              <div className="flex flex-col gap-4 items-center basis-1/4 ">
                <div className="text-center leading-9 ">Ảnh đại diện</div>
                {selectedImage === '' ? (
                  <img
                    src={image ? image : ava}
                    alt="Ảnh đại diện"
                    className="w-52 h-52 rounded-lg object-contain"
                  />
                ) : (
                  <div
                    className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url(${selectedImage})` }}
                  ></div>
                )}
                <div className="mt-6">Thay đổi ảnh đại diện</div>
                <input
                  type="file"
                  className="block file:bg-violet-100 file:text-violet-700 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-200"
                  id="inputImage"
                  onChange={(e: any) => handleChangeImg(e)}
                />
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
          <div>
            <div className="title text-center">DANH SÁCH NHÂN VIÊN</div>
            <User
              department_id={id}
              isDepartment={true}
              triggerLoading={triggerLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DetailDepartment;
