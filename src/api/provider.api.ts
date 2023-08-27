import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const providerApi = {
  list(page: number): Promise<CommonResponse> {
    const url = `provider/list?page=${page}`;
    return axiosClient.get(url);
  },
  create(params: object): Promise<CommonResponse> {
    const url = 'provider/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `provider/detail?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'provider/update';
    return axiosClient.put(url, params);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'provider/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  search(keyword: string): Promise<CommonResponse> {
    const url = `provider/search?keyword=${keyword}`;
    return axiosClient.get(url);
  },
}

export default providerApi;