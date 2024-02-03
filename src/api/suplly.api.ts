import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const supplyApi = {
  list(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `supplies/list?${paramString}`;
    return axiosClient.get(url);
  },
  listSuppliesByWarehouse(params: any): Promise<CommonResponse> {
    const paramString = new URLSearchParams(params).toString();
    const url = `supplies//list_supply_by_warehouse?${paramString}`;
    return axiosClient.get(url);
  },
  listByDepart(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `supplies/list_by_depart?${paramString}`;
    return axiosClient.get(url);
  },
  create(params: object): Promise<CommonResponse> {
    const url = 'supplies/create';
    return axiosClient.post(url, params);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'supplies/update';
    return axiosClient.patch(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `supplies/detail?id=${id}`;
    return axiosClient.get(url);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'supplies/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  uploadExcel(params: any): Promise<CommonResponse> {
    const url = 'supplies/import_by_excel';
    return axiosClient.post(url, params);
  },
  getReportSupplies(params: any): Promise<CommonResponse> {
    const url = 'supplies/create_report';
    return axiosClient.post(url, params);
  },
  getReportSuppliesByWarehouse(params: any): Promise<CommonResponse> {
    const url = 'supplies/create_report_by_warehouse';
    return axiosClient.post(url, params);
  },
};

export default supplyApi;
