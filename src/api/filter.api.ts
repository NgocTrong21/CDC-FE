import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const filterApi = {
  getStatusEquipmentApi(): Promise<CommonResponse> {
    const url = 'category/status/list';
    return axiosClient.get(url);
  },
  getGroupEquipmentApi(): Promise<CommonResponse> {
    const url = 'category/group/list';
    return axiosClient.get(url);
  },
  getTypeEquipmentApi(): Promise<CommonResponse> {
    const url = 'category/type/list';
    return axiosClient.get(url);
  },
  getDepartmentApi(): Promise<CommonResponse> {
    const url = 'department/search';
    return axiosClient.get(url);
  },
  getProjectApi(): Promise<CommonResponse> {
    const url = 'project/list';
    return axiosClient.get(url);
  },
  getCycleProceduceApi(): Promise<CommonResponse> {
    const url = '/get_all_cycle_procedure';
    return axiosClient.get(url);
  },
  getServiceApi(): Promise<CommonResponse> {
    const url = 'service/list';
    return axiosClient.get(url);
  },
  getAllRoleApi(): Promise<CommonResponse> {
    const url = 'role/list';
    return axiosClient.get(url);
  },
  getAllUnitApi(): Promise<CommonResponse> {
    const url = 'category/unit/list';
    return axiosClient.get(url);
  },
  getAllRiskLevelApi(): Promise<CommonResponse> {
    const url = 'category/risk_level/list';
    return axiosClient.get(url);
  },
  getProviderApi(): Promise<CommonResponse> {
    const url = 'provider/list';
    return axiosClient.get(url);
  },
};

export default filterApi;
