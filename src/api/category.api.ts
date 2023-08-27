import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const categoryApi = {
  //Equipment_Group Api
  listGroup(page: number): Promise<CommonResponse> {
    const url = `category/group/list?page=${page}`;
    return axiosClient.get(url);
  },
  createGroup(params: object): Promise<CommonResponse> {
    const url = 'category/group/create';
    return axiosClient.post(url, params);
  },
  detailGroup(id: number): Promise<CommonResponse> {
    const url = `category/group/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateGroup(params: object): Promise<CommonResponse> {
    const url = 'category/group/update';
    return axiosClient.put(url, params);
  },
  deleteGroup(id: number): Promise<CommonResponse> {
    const url = 'category/group/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  searchGroup(name: string): Promise<CommonResponse> {
    const url = `category/group/search?name=${name}`;
    return axiosClient.get(url);
  },

  //Equipment_Type
  listType(page: number): Promise<CommonResponse> {
    const url = `category/type/list?page=${page}`;
    return axiosClient.get(url);
  },
  listTypeBaseGroup(group_id: number): Promise<CommonResponse> {
    const url = `category/type/list_base_group?group_id=${group_id}`;
    return axiosClient.get(url);
  },
  createType(params: object): Promise<CommonResponse> {
    const url = 'category/type/create';
    return axiosClient.post(url, params);
  },
  detailType(id: number): Promise<CommonResponse> {
    const url = `category/type/detail?id=${id}`;
    return axiosClient.get(url);
  },
  updateType(params: object): Promise<CommonResponse> {
    const url = 'category/type/update';
    return axiosClient.put(url, params);
  },
  deleteType(id: number): Promise<CommonResponse> {
    const url = 'category/type/delete';
    return axiosClient.delete(url, {
      data: { id }
    });
  },
  searchType(name: string): Promise<CommonResponse> {
    const url = `category/type/search?name=${name}`;
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
      data: { id }
    });
  },
  searchUnit(name: string): Promise<CommonResponse> {
    const url = `category/unit/search?name=${name}`;
    return axiosClient.get(url);
  },

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
      data: { id }
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
}

export default categoryApi;