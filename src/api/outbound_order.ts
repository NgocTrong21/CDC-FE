import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const outboundOrderApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'outbound_order/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `outbound_order/detail?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'outbound_order/update';
    return axiosClient.post(url, params);
  },
  search(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `outbound_order/search?${paramString}`;
    return axiosClient.get(url);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'outbound_order/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  accept(params: object): Promise<CommonResponse> {
    const url = 'outbound_order/accept';
    return axiosClient.post(url, params);
  },
};

export default outboundOrderApi;
