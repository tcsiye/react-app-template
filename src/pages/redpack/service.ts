import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';
const RedpackService = {
  async queryList() {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/red-packets`,
    }).then(errorProcess);
  },
  async queryById(id) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/red-packets/${id}`,
    }).then(errorProcess);
  },
  async save(data) {
    return request({
      data,
      method: data.id ? 'put' : 'post',
      url: `mall/api/v0.1/red-packets`,
    }).then(errorProcess);
  },
  async toggleStatus(id) {
    return request({
      method: 'put',
      url: `/mall/api/v0.1/red-packets/toggleStatus/${id}`,
    }).then(errorProcess);
  },
};
export default RedpackService;
