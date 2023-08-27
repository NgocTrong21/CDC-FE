import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentRepairApi = {
  getBrokenAndRepairEqList(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_repair/list/broken_and_repair?${paramString}`;
    return axiosClient.get(url);
  },
  updateScheduleRepair(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/update_schedule_repair';
    return axiosClient.post(url, params);
  },
  getHistoryRepair(id: number): Promise<CommonResponse> {
    const url = `equipment_repair/history_repair?id=${id}`;
    return axiosClient.get(url);
  },
  getRepairSchedule(id: number): Promise<CommonResponse> {
    const url = `equipment_repair/get_repair_schedule?id=${id}`;
    return axiosClient.get(url);
  },
  reHandover(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/re_handover';
    return axiosClient.post(url, params);
  }
}

export default equipmentRepairApi;