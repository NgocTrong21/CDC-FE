import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const departmentApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'department/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `department/detail?id=${id}`;
    return axiosClient.get(url);
  },
  statisticEquipmentByDepartment(id: number): Promise<CommonResponse> {
    const url = `department/statistic_equipment_by_department?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'department/update';
    return axiosClient.patch(url, params);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'department/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  search(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `department/search?${paramString}`;
    return axiosClient.get(url);
  },
  listEmployees(department_id: number): Promise<CommonResponse> {
    const url = `department/list_employees?department_id=${department_id}`;
    return axiosClient.get(url);
  },
}

export default departmentApi;