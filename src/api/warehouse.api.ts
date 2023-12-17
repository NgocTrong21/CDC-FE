import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const warehouseApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'warehouse/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `warehouse/detail?id=${id}`;
    return axiosClient.get(url);
  },
  suppliesByWarehouse(id: number): Promise<CommonResponse> {
    const url = `warehouse//supplies_by_warehouse?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'warehouse/update';
    return axiosClient.post(url, params);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'warehouse/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  search(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `warehouse/search?${paramString}`;
    return axiosClient.get(url);
  },
};

export default warehouseApi;
