import { Card, Divider } from 'antd';
import equipmentApi from 'api/equipment.api';
import { useState, useEffect } from 'react';
import news from 'assets/not_handed.png';
import active from 'assets/active.png';
import broken from 'assets/was_broken.png';
import repair from 'assets/corrected.png';
import unused from 'assets/inactive.png';
import liquidation from 'assets/liquidation.png';
import { Column, Pie } from '@ant-design/plots';
import './index.css';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const Dashboard = () => {

  const navigate = useNavigate();
  const [countByStatus, setCountByStatus] = useState<any>([]);
  const [countByDepartment, setCountByDepartment] = useState<any>([]);
  const [countByLevel, setCountByLevel] = useState<any>([]);
  const [countBroken, setCountBroken] = useState<any>([]);
  const [sumBroken, setSumBroken] = useState<number>(0);
  const [countRepair, setCountRepair] = useState<any>([]);
  const [sumRepair, setSumRepair] = useState<number>(0);

  const count = async () => {
    equipmentApi.statisticDashboard()
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setCountByDepartment(data.count_department);
          setCountByLevel(data.count_level);
          let newCountStatus = data.count_status?.map((item: any) => {
            if (item.status_id === 2) {
              item.image = news;
            }
            if (item.status_id === 3) {
              item.image = active;
            }
            if (item.status_id === 4) {
              item.image = broken;
            }
            if (item.status_id === 5) {
              item.image = repair;
            }
            if (item.status_id === 6) {
              item.image = unused;
            }
            if (item.status_id === 7) {
              item.image = liquidation;
            }
            return item;
          });
          setCountByStatus(newCountStatus);
          setCountBroken(data.count_broken);
          setCountRepair(data.count_repair);
          let sumBroken = data?.count_broken?.reduce(function (acc: number, obj: any) { return acc + obj.value; }, 0);
          setSumBroken(sumBroken);
          let sumRepair = data?.count_repair?.reduce(function (acc: number, obj: any) { return acc + obj.value; }, 0);
          setSumRepair(sumRepair);
        }
      })
  }

  useEffect(() => {
    count();
  }, []);

  const data_department = countByDepartment?.length > 0 ? countByDepartment : [];
  const config_department: any = {
    data: data_department,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
      },
    },
    meta: {
      type: {
        alias: 'name',
      },
      value: {
        alias: 'Số lượng thiết bị',
      },
    },
  };

  const data_level = countByLevel?.length > 0 ? countByLevel : [];
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
  }

  const data_broken = countBroken?.length > 0 ? countBroken : [];
  const config_broken: any = {
    appendPadding: 10,
    data: data_broken,
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
  }

  const data_repair = countRepair?.length > 0 ? countRepair : [];
  const config_repair: any = {
    appendPadding: 10,
    data: data_repair,
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
  }

  return (
    <>
      <div className="title text-center">DASHBOARD</div>
      <Divider />
      <div>
        <div className='mb-8'>
          <div className="title mb-6">Thống kê thiết bị theo trạng thái</div>
          <div className='grid grid-cols-6'>
            {
              countByStatus?.length > 0 && countByStatus.map((item: any) => (
                <Card
                  hoverable
                  style={{ width: 180 }}
                  cover={<img alt="status" src={item.image} />}
                  className="count"
                  onClick={() => navigate(`equipment/list_eq?page_search=1&status_id=${item.status_id}`)}
                >
                  <Meta title={item.type} description={`${item.value} thiết bị`} />
                </Card>
              ))
            }
          </div>
        </div>
        <div className='mb-8'>
          <div className="title mb-6">Thống kê thiết bị theo khoa phòng</div>
          <Card title="Biểu đồ thống kê" hoverable>
            <Column
              {...config_department}
              onReady={(plot) => {
                plot.on('plot:click', (evt: any) => {
                  const { data } = evt;
                  navigate(`/equipment/list_eq?page_search=1&department_id=${data?.data?.department_id}`);
                });
              }}
            />
          </Card>
        </div>
        <div className='mb-8'>
          <div className="title mb-6">Thống kê thiết bị đang báo hỏng ({sumBroken} thiết bị)</div>
          <Pie
            {...config_broken}
            onReady={(plot) => {
              plot.on('plot:click', (evt: any) => {
                const { data } = evt;
                navigate(`/equipment/list_eq?page_search=1&status_id=4&department_id=${data?.data?.department_id}`);
              });
            }}
          />
        </div>
        <div className='mb-8'>
          <div className="title mb-6">Thống kê thiết bị đang sửa chữa ({sumRepair} thiết bị)</div>
          <Pie
            {...config_repair}
            onReady={(plot) => {
              plot.on('plot:click', (evt: any) => {
                const { data } = evt;
                navigate(`/equipment/list_eq?page_search=1&status_id=5&department_id=${data?.data?.department_id}`);
              });
            }}
          />
        </div>
        <div className='mb-8'>
          <div className="title mb-6">Thống kê thiết bị theo mức độ rủi ro</div>
          <Pie
            {...config_level}
            onReady={(plot) => {
              plot.on('plot:click', (evt: any) => {
                const { data } = evt;
                navigate(`/equipment/list_eq?page_search=1&risk_level=${data?.data?.risk_level}`);
              });
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Dashboard