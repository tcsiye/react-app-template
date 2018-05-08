import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import axios, { AxiosResponse } from 'axios';
const ChannelService = {
  async queryTreeList() {
    return request({
      method: 'get',
      url: `/usercenter/api/v0.1/organizations/tree-list/type/1`,
    }).then(errorProcess);
  },
  async queryOrganizations(id, callback?) {
    const source = axios.CancelToken.source();
    if (callback) {
      callback(source);
    }
    return request({
      method: 'get',
      url: `/usercenter/api/v0.1/organizations/parent-id/${id}`,
      cancelToken: source.token
    }).then(errorProcess);
  },
  async queryOrganizationMembers(id, callback?) {
    const source = axios.CancelToken.source();
    if (callback) {
      callback(source);
    }
    return request({
      method: 'get',
      url: `/usercenter/api/v0.1/organization-members/organization-id/${id}`,
      cancelToken: source.token
    }).then(errorProcess);
  },
  async queryOrganizationCars(id) {
    return request({
      method: 'get',
      url: `/usercenter/api/v0.1/organization-cars/organization-id/${id}`,
    }).then(errorProcess);
  },
  async saveOrganization(data) {
    return request({
      data,
      method: 'post',
      url: `/usercenter/api/v0.1/organizations/back-stage/${data.id ? 'update' : 'save'}`,
    }).then(errorProcess);
  },
  async deleteOrganization(id) {
    return request({
      method: 'delete',
      url: `/usercenter/api/v0.1/organizations/${id}`,
    }).then(errorProcess);
  },
  /** 获取用户下渠道 */
  async queryUserOrganizations(id) {
    return request({
      method: 'get',
      url: `/usercenter/api/v0.1/organizations/common-org/user/${id}`,
    }).then(errorProcess);
  },
  async updateOrganizationMembers(data) {
    return request({
      data,
      method: 'post',
      url: `/usercenter/api/v0.1/organization-members/update`,
    }).then(errorProcess);
  },
  async deleteOrganizationMembers(organizationId, userId) {
    return request({
      method: 'delete',
      url: `/usercenter/api/v0.1/organization-members/organization/${organizationId}/user/${userId}`,

    }).then(errorProcess);
  },
  async addOrganizationMembers(data: {csvStr: string, organizationId: string|number }) {
    return request({
      data,
      method: 'post',
      url: `/usercenter/api/v0.1/organization-members/add`,
    }).then(errorProcess);
  },

};
export default ChannelService;
