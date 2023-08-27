import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const notificationApi = {
  list(page: number): Promise<CommonResponse> {
    const url = `notification/list?page=${page}`;
    return axiosClient.get(url);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'notification/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  update(params: object): Promise<CommonResponse> {
    const url = 'notification/update_is_seen';
    return axiosClient.post(url, params);
  }
}

export default notificationApi;