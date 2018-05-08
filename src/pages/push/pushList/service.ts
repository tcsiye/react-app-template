import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';

const PushService = {
  async queryList(params) {
    return request({
      method: 'get',
      url: `/message/api/push-events/get/page?${qs.stringify(params)}`
    }).then(errorProcess);
  },
  async queryById(id) {
    return request({
      method: 'get',
      url: `/message/api/push-events/get/${id}`,
    }).then(errorProcess);
  },
  async save(data) {
    return request({
      data,
      method: 'post',
      url: `/message/api/push-events/${data.id ? 'update' : 'create'}`,
    }).then(errorProcess);
  },
  async push(id) {
    return request({
      method: 'post',
      url: `/message/api/v0.1/push/${id}`,
    }).then(errorProcess);
  },
  async preview(data) {
    return request({
      data,
      method: 'post',
      url: `/message/api/v0.1/push/preview`,
    }).then(errorProcess);
  }

};
export default PushService;
