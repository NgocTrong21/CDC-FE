import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentTransferApi = {
  search(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_transfer/search?${paramString}`;
    return axiosClient.get(url);
  },
  transfer(params: object): Promise<CommonResponse> {
    const url = 'equipment_transfer/transfer';
    return axiosClient.post(url, params);
  },
  updateTransferReport(params: any): Promise<CommonResponse> {
    const url = 'equipment_transfer/update_transfer_report';
    return axiosClient.patch(url, params);
  },
  approveTransferReport(params: object): Promise<CommonResponse> {
    const url = 'equipment_transfer/approve_transfer_report';
    return axiosClient.patch(url, params);
  },
  detail(id: number, transfer_id: number): Promise<CommonResponse> {
    const url = `equipment_transfer/detail?id=${id}&transfer_id=${transfer_id}`;
    return axiosClient.get(url);
  },
  getHistoryTransfer(id: number): Promise<CommonResponse> {
    const url = `equipment_transfer/history_transfer?id=${id}`;
    return axiosClient.get(url);
  },
}

export default equipmentTransferApi;