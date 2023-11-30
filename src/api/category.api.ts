import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const categoryApi = {
  //Equipment_Status
  listStatus(): Promise<CommonResponse> {
    const url = 'category/status/list';
    return axiosClient.get(url);
  },
  createStatus(params: object): Promise<CommonResponse> {
    const url = 'category/status/create';
    return axiosClient.post(url, params);
  },
  detailStatus(id: number): Promise<CommonResponse> {
    const url = `category/status/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateStatus(params: object): Promise<CommonResponse> {
    const url = 'category/status/update';
    return axiosClient.put(url, params);
  },
  deleteStatus(id: number): Promise<CommonResponse> {
    const url = 'category/status/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  searchStatus(name: string): Promise<CommonResponse> {
    const url = `category/status/search?name=${name}`;
    return axiosClient.get(url);
  },

  //Repair_Status
  listRepairStatus(): Promise<CommonResponse> {
    const url = 'category/repair_status/list';
    return axiosClient.get(url);
  },
  createRepairStatus(params: object): Promise<CommonResponse> {
    const url = 'category/repair_status/create';
    return axiosClient.post(url, params);
  },

  //Suplly_Type API
  listSypplyType(): Promise<CommonResponse> {
    const url = 'category/supplies_type/list';
    return axiosClient.get(url);
  },
  //Equipment_Unit
  listUnit(): Promise<CommonResponse> {
    const url = 'category/unit/list';
    return axiosClient.get(url);
  },
  createUnit(params: object): Promise<CommonResponse> {
    const url = 'category/unit/create';
    return axiosClient.post(url, params);
  },
  detailUnit(id: number): Promise<CommonResponse> {
    const url = `category/unit/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateUnit(params: object): Promise<CommonResponse> {
    const url = 'category/unit/update';
    return axiosClient.put(url, params);
  },
  deleteUnit(id: number): Promise<CommonResponse> {
    const url = 'category/unit/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  searchUnit(name: string): Promise<CommonResponse> {
    const url = `category/unit/search?name=${name}`;
    return axiosClient.get(url);
  },
};

export default categoryApi;
