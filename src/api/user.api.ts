import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const userApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'user/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `user/detail?id=${id}`;
    return axiosClient.get(url);
  },
  getProfile(id: number): Promise<CommonResponse> {
    const url = `user/profile?id=${id}`;
    return axiosClient.get(url);
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'user/update';
    return axiosClient.put(url, params);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'user/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  search(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `user/search?${paramString}`;
    return axiosClient.get(url);
  },
  updateProfile(params: object): Promise<CommonResponse> {
    const url = 'user/update_profile';
    return axiosClient.patch(url, params);
  },
  uploadExcel(params: any): Promise<CommonResponse> {
    const url = 'user/upload_excel';
    return axiosClient.post(url, params);
  }
}

export default userApi;