import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const equipmentRepairApi = {
  reportEquipment(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/report';
    return axiosClient.post(url, params);
  },
  getBrokenReport(id: number, repair_id: number): Promise<CommonResponse> {
    const url = `equipment_repair/detail_broken_report?id=${id}&repair_id=${repair_id}`;
    return axiosClient.get(url);
  },
  getHighestRepairCost(): Promise<CommonResponse> {
    const url = 'equipment_repair/get_highest_repair_cost';
    return axiosClient.get(url);
  },
  approveBrokenReport(params: any): Promise<CommonResponse> {
    const url = 'equipment_repair/approve_broken_report';
    return axiosClient.put(url, params);
  },
  updateBrokenReport(params: any): Promise<CommonResponse> {
    const url = 'equipment_repair/update_broken_report';
    return axiosClient.put(url, params);
  },
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
  createScheduleRepair(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/create_schedule_repair';
    return axiosClient.patch(url, params);
  },
  updateScheduleRepair(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/update_schedule_repair';
    return axiosClient.patch(url, params);
  },
  approveScheduleRepair(params: any): Promise<CommonResponse> {
    const url = 'equipment_repair/approve_schedule_repair';
    return axiosClient.patch(url, params);
  },
  acceptanceRepair(params: any): Promise<CommonResponse> {
    const url = 'equipment_repair/acceptance_repair';
    return axiosClient.patch(url, params);
  },
  getHistoryRepair(id: number): Promise<CommonResponse> {
    const url = `equipment_repair/history_repair?id=${id}`;
    return axiosClient.get(url);
  },
  getRepairSchedule(id: number, repair_id: number): Promise<CommonResponse> {
    const url = `equipment_repair/get_repair_schedule?id=${id}&repair_id=${repair_id}`;
    return axiosClient.get(url);
  },
  reHandover(params: object): Promise<CommonResponse> {
    const url = 'equipment_repair/re_handover';
    return axiosClient.post(url, params);
  },
};

export default equipmentRepairApi;
