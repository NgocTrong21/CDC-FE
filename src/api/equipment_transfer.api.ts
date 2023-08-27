import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentTransferApi = {
  list(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_transfer/list?${paramString}`;
    return axiosClient.get(url);
  },
  transfer(params: object): Promise<CommonResponse> {
    const url = 'equipment_transfer/transfer';
    return axiosClient.post(url, params);
  },
  approverTransfer(params: object): Promise<CommonResponse> {
    const url = 'equipment_transfer/approver_transfer';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `equipment_transfer/detail?equipment_id=${id}`;
    return axiosClient.get(url);
  }
}

export default equipmentTransferApi;