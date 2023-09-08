import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentLiquidationApi = {
  getListUnusedEquipment(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_liquidation/list_unused_equipment?${paramString}`;
    return axiosClient.get(url);
  },
  createLiquidationNote(params: object): Promise<CommonResponse> {
    const url = 'equipment_liquidation/create_liquidation_note';
    return axiosClient.post(url, params);
  },
  getLiquidationDetail(id: number, liquidation_id: number): Promise<CommonResponse> {
    const url = `equipment_liquidation/get_liquidation_detail?id=${id}&liquidation_id=${liquidation_id}`;
    return axiosClient.get(url);
  },
  approveLiquidationNote(params: object): Promise<CommonResponse> {
    const url = 'equipment_liquidation/approve_liquidation_note';
    return axiosClient.patch(url, params);
  },
  updateLiquidationNote(params: object): Promise<CommonResponse> {
    const url = 'equipment_liquidation/update_liquidation_note';
    return axiosClient.patch(url, params);
  },
  getHistoryLiquidation(id: number): Promise<CommonResponse> {
    const url = `equipment_liquidation/history_liquidation?id=${id}`;
    return axiosClient.get(url);
  },
}

export default equipmentLiquidationApi;