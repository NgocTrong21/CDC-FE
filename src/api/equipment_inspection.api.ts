import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentInspectionApi = {
  getInspectionList(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_inspection/search?${paramString}`;
    return axiosClient.get(url);
  },
  inspectEquipment(params: any): Promise<CommonResponse> {
    const url = 'equipment_inspection/inspect_equipment';
    return axiosClient.put(url, params);
  },
  detailInspection(id: number, inspection_id: number): Promise<CommonResponse> {
    const url = `equipment_inspection/detail?id=${id}&inspection_id=${inspection_id}`;
    return axiosClient.get(url);
  },
  updateInspectionReport(params: any): Promise<CommonResponse> {
    const url = 'equipment_inspection/update_inspection_report';
    return axiosClient.patch(url, params);
  },
  approveInspectionReport(params: any): Promise<CommonResponse> {
    const url = 'equipment_inspection/approve_inspection_report';
    return axiosClient.patch(url, params);
  },
  getHistoryInspection(id: number): Promise<CommonResponse> {
    const url = `equipment_inspection/history_inspection?id=${id}`;
    return axiosClient.get(url);
  },
}

export default equipmentInspectionApi;