import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentMaintenance = {
  getMaintenanceList(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_maintenance/list?${paramString}`;
    return axiosClient.get(url);
  }
}

export default equipmentMaintenance;