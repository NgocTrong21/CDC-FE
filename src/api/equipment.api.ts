import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'equipment/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `equipment/detail?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'equipment/update';
    return axiosClient.patch(url, params);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'equipment/delete';
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
    const url = `equipment/search?${paramString}`;
    return axiosClient.get(url);
  },
  uploadExcel(params: any): Promise<CommonResponse> {
    const url = 'equipment/create_by_excel';
    return axiosClient.post(url, params);
  },
  statisticDashboard(): Promise<CommonResponse> {
    const url = 'equipment/statistic_dashboard';
    return axiosClient.get(url);
  },
  reportEquipment(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/report';
    return axiosClient.post(url, params);
  },
  getEquipmentRepairInfo(id: number): Promise<CommonResponse> {
    const url = `equipment_repair/equipment_repair_info?id=${id}`;
    return axiosClient.get(url);
  },
  downloadDocx(): Promise<CommonResponse> {
    const url = 'equipment/download_docx';
    return axiosClient.get(url);
  }
}

export default equipmentApi;