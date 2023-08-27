import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const permissionApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'permission/create';
    return axiosClient.post(url, params);
  },
  createGroup(params: object): Promise<CommonResponse> {
    const url = 'permission/create_group';
    return axiosClient.post(url, params);
  },
  list(): Promise<CommonResponse> {
    const url = 'permission/list';
    return axiosClient.get(url);
  },
  updatePermissionForRole(params: object): Promise<CommonResponse> {
    const url = 'permission/update_permisison_for_role';
    return axiosClient.put(url, params);
  }
}

export default permissionApi;