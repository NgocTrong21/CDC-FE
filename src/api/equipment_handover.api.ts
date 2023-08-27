import axiosClient from "./axiosClient";
import { CommonResponse } from 'types/common.type';

const equipmentHandoverApi = {
  handoverEquipment(params: object): Promise<CommonResponse> {
    const url = 'equipment_handover/handover';
    return axiosClient.post(url, params);
  },
  sendEmailHandoverReport(params: object): Promise<CommonResponse> {
    const url = 'equipment_handover/send_email_handover_report';
    return axiosClient.post(url, params);
  },
  getListHandoverEquipment(page: number, name: string, department_id: any, handover_date: any): Promise<CommonResponse> {
    let params: any = {
      name,
      department_id,
      handover_date
    }
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `equipment_handover/list/handover?page=${page}&${paramString}`;
    return axiosClient.get(url);
  },
  getHandoverInfo(id: number): Promise<CommonResponse> {
    const url = `equipment_handover/handover_info?id=${id}`;
    return axiosClient.get(url);
  },
}

export default equipmentHandoverApi;