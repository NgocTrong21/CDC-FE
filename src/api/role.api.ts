import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const roleApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'role/create';
    return axiosClient.post(url, params);
  },
  list(): Promise<CommonResponse> {
    const url = 'role/list';
    return axiosClient.get(url);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `role/detail?id=${id}`;
    return axiosClient.get(url);
  },
  addRoleEmailConfig(params: object): Promise<CommonResponse> {
    const url = 'role/add_role_email_config';
    return axiosClient.post(url, params);
  },
  configRoleEmail(params: object): Promise<CommonResponse> {
    const url = 'role/config_role_email';
    return axiosClient.post(url, params);
  },
  listRoleEmailConfig(): Promise<CommonResponse> {
    const url = 'role/list_role_email_config';
    return axiosClient.get(url);
  }
}

export default roleApi;