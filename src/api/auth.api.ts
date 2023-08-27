import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const authApi = {
  login(params: object): Promise<CommonResponse> {
    const url = 'auth/login';
    return axiosClient.post(url, params);
  },
  register(params: object): Promise<CommonResponse> {
    const url = 'auth/register';
    return axiosClient.post(url, params);
  },
  active(params: object): Promise<CommonResponse> {
    const url = 'auth/active';
    return axiosClient.post(url, params);
  },
  changePassword(params: object): Promise<CommonResponse> {
    const url = 'auth/change_password';
    return axiosClient.patch(url, params);
  }
}

export default authApi;